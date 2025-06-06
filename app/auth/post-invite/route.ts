// app/auth/post-invite/route.ts
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function PostInvitePage({ searchParams }: { searchParams: { token?: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !searchParams.token) {
        return redirect('/wishlists')
    }

    const token = searchParams.token

    const invite = await prisma.invite.findUnique({
        where: { token },
    })

    if (!invite || invite.status !== 'PENDING') {
        return redirect('/wishlists') // invalid or already used invite
    }

    // Ensure the logged-in user is the invitee OR let any user accept it
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (!user) return redirect('/wishlists')

    // Add user to the exchange if not already a member
    const existing = await prisma.giftExchangeMember.findUnique({
        where: {
            userId_giftExchangeId: {
                userId: user.id,
                giftExchangeId: invite.exchangeId,
            },
        },
    })

    if (!existing) {
        await prisma.giftExchangeMember.create({
            data: {
                userId: user.id,
                giftExchangeId: invite.exchangeId,
                role: 'MEMBER',
            },
        })
    }

    // Mark invite as accepted
    await prisma.invite.update({
        where: { token },
        data: { status: 'ACCEPTED' },
    })

    return redirect(`/giftexchanges`)
}
