// app/api/invites/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
    try {


        const session = await requireSession()
        const { email, exchangeId } = await req.json()
        console.log(`email ${email}`)
        console.log(`giftExchangeId: ${exchangeId}`)

        if (!email || !exchangeId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Ensure the current user is an admin of the gift exchange
        const membership = await prisma.giftExchangeMember.findUnique({
            where: {
                userId_giftExchangeId: {
                    userId: session.user.id,
                    giftExchangeId: exchangeId,
                },
            },
        })

        if (!membership || membership.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const token = randomUUID()

        const invite = await prisma.invite.create({
            data: {
                email,
                token,
                exchangeId,
            },
        })

        return NextResponse.json({ invite })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}