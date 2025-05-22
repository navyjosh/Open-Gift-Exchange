// app/giftexchanges/GiftExchangeList.tsx
'use client'

import Link from 'next/link'

export default function GiftExchangeList({ exchanges }: { exchanges: any[] }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">🎁 My Gift Exchanges</h1>

            {exchanges.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                    You are not a member of any gift exchanges yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {exchanges.map((exchange) => (
                        <li key={exchange.id} className="border p-4 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{exchange.name}</h2>
                                    {exchange.members[0]?.role && (
                                        <p className="text-sm text-gray-500 italic">
                                            Role: {exchange.members[0].role}
                                        </p>
                                    )}
                                </div>
                                <Link
                                    href={`/giftexchanges/${exchange.id}`}
                                    className="text-blue-600 text-sm underline hover:text-blue-800"
                                >
                                    View →
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
