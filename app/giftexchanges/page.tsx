// app/giftexchanges/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGiftExchange } from '@/lib/api'
import { requireSession } from '@/lib/auth/session'

export default async function GiftExchangesPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const session = await requireSession()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await createGiftExchange({ name })
            setName('')
            router.refresh()
        } catch (err) {
            setError('Failed to create gift exchange.')
        } finally {
            setLoading(false)
        }
    }
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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">🎉 My Gift Exchanges</h1>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Exchange Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                        placeholder="e.g. Family Secret Santa"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>

            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    )
}
