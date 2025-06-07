import { sendInviteEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
    try {
        const session = await requireSession()
        const { email, exchangeId, exchangeName } = await req.json()
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

        
        await sendInviteEmail({
            to: email,
            inviterName: session.user.name || "Someone",
            exchangeName: exchangeName,
            inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${token}`
        })

        return NextResponse.json({ invite })
    } catch (err) {
        return NextResponse.json({ error: `Invalid request, ${err}` }, { status: 400 });
    }
}