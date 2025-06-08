import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/auth/session'

export async function POST(req: Request) {
    try {
        const session = await requireSession()
        const { userId, exchangeId } = await req.json()

        if (!userId || !exchangeId) {
            return NextResponse.json({ error: 'Missing userId or exchangeId' }, { status: 400 })
        }

        // Ensure current user is admin of the exchange
        const adminMembership = await prisma.giftExchangeMember.findUnique({
            where: {
                userId_giftExchangeId: {
                    userId: session.user.id,
                    giftExchangeId: exchangeId,
                },
            },
        })

        if (!adminMembership || adminMembership.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        // Prevent removing self as admin
        if (session.user.id === userId) {
            return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 })
        }

        // Revoke membership
        await prisma.giftExchangeMember.delete({
            where: {
                userId_giftExchangeId: {
                    userId,
                    giftExchangeId: exchangeId,
                },
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
