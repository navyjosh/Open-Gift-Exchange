// app/api/exchanges/[id]/members/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const exchangeId = params.id

    if (!exchangeId) {
        return NextResponse.json({ error: 'Missing exchange ID' }, { status: 400 })
    }

    try {
        const members = await prisma.giftExchangeMember.findMany({
            where: { giftExchangeId: exchangeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json({ members })
    } catch (err) {
        console.error('Failed to load members:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
