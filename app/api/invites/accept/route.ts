import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { requireSession } from '@/lib/auth/session'

export async function POST(req: Request) {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('inviteToken')?.value

    let token = cookieToken

    // If not in cookie, fall back to request body
    if (!token) {
        try {
            const body = await req.json()
            token = body.token
        } catch {
            // ignore parse errors
        }
    }

    if (!token) {
        return NextResponse.json({ error: 'No invite token provided' }, { status: 400 })
    }

    const session = await requireSession()

    const invite = await prisma.invite.findUnique({
        where: { token },
    })

    if (!invite) {
        return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 })
    }

    if (invite.status !== 'PENDING') {
        return NextResponse.json({ error: `Invite already ${invite.status.toLowerCase()}` }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = await prisma.giftExchangeMember.findUnique({
        where: {
            userId_giftExchangeId: {
                userId: session.user.id,
                giftExchangeId: invite.exchangeId,
            },
        },
    })

    if (existingMember) {
        return NextResponse.json({ message: 'Already a member' })
    }

    // Add user as member
    await prisma.giftExchangeMember.create({
        data: {
            userId: session.user.id,
            giftExchangeId: invite.exchangeId,
            role: 'MEMBER',
        },
    })

    // Update invite status
    await prisma.invite.update({
        where: { token },
        data: { status: 'ACCEPTED' },
    })

    // Clear the token cookie if it existed
    if (cookieToken) {
        cookieStore.set('inviteToken', '', { path: '/', maxAge: 0 })
    }

    return NextResponse.json({ success: true })
}
