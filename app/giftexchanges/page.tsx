import { requireSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import GiftExchangeList from './GiftExchangeList'
import { NewGiftExchangeButton } from '@/components/NewGiftExchangeButton'

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

    return (
        <main className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Welcome, {session.user.name ?? 'User'}
            </h1>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Gift Exchanges</h2>
                <NewGiftExchangeButton />
            </div>

            <ul className="space-y-4">
                <GiftExchangeList exchanges={exchanges} />
            </ul>
        </main>
    )
}
