import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/auth/session'

export async function GET(req: Request) {
    try {
        const session = await requireSession()
        const { memberId, exchangeId, userId } = await req.json()

        if (!memberId || !exchangeId) {
            return NextResponse.json({ error: 'Missing memberId or exchangeId' }, { status: 400 })
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
        if (session.user.id === memberId) {
            return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 })
        }

        // Revoke membership
        await prisma.giftExchangeMember.delete({where: {id: memberId}})

        await prisma.invite.deleteMany({
            where: {
                userId: userId,
                exchangeId: exchangeId,
            },
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: `Internal server error: ${err}` }, { status: 500 })
    }
}
