// app/giftexchanges/page.tsx
import { requireSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import GiftExchangeList from './GiftExchangeList'

export default async function GiftExchangesPage() {
    const session = await requireSession()

    const exchanges = await prisma.giftExchange.findMany({
        where: {
            members: {
                some: { userId: session.user.id },
            },
        },
        include: {
            members: {
                where: { userId: session.user.id },
                select: { role: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return <GiftExchangeList exchanges={exchanges} />
}
