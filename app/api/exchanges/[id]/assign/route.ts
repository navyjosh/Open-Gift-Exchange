// app/api/exchanges/[id]/assign/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const exchangeId = params.id

    if (!exchangeId) {
        return NextResponse.json({ error: 'Missing exchange ID' }, { status: 400 })
    }

    const members = await prisma.giftExchangeMember.findMany({
        where: { giftExchangeId: exchangeId },
    })

    if (members.length < 2) {
        return NextResponse.json({ error: 'At least 2 members required' }, { status: 400 })
    }

    // Clear previous assignments
    await prisma.giftExchangeMember.updateMany({
        where: { giftExchangeId: exchangeId },
        data: { assignedToId: null },
    })

    // Shuffle the members
    const shuffled = [...members].sort(() => Math.random() - 0.5)

    const assignments: { id: string; assignedToId: string }[] = []

    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i]
        const receiver = shuffled[(i + 1) % shuffled.length] // wrap around

        assignments.push({ id: giver.id, assignedToId: receiver.id })
    }

    // Update all members
    for (const { id, assignedToId } of assignments) {
        await prisma.giftExchangeMember.update({
            where: { id },
            data: { assignedToId },
        })
    }

    return NextResponse.json({ success: true })
}
