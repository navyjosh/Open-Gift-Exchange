'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { GiftExchange } from '@prisma/client'
import { Invite } from '@prisma/client'



export function InviteList( { exchange }: {exchange: GiftExchange & { invites: Invite[]}}) {
    const [invites, setInvites] = useState<Invite[]>(exchange.invites)
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const exchangeId = exchange.id
    const exchangeName = exchange.name
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            try {
                const res = await fetch('/api/invites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, exchangeId, exchangeName }),
                })
                const data = await res.json()

                if (!res.ok) {
                    setError(data?.error || 'Failed to send invite')
                    return
                }

                
                setEmail('')
                setInvites((prev) => [...prev, data.invite])
                console.log(`invites: ${invites}`)
            } catch (err) {
                setError('Something went wrong.')
                console.error(err)
            }
        })
    }

    return (
        <>
            <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Invitations:</p>
                {invites.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No invites yet.</p>
                ) : (
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {invites.map((invite) => (
                            <li key={invite.id}>
                                <span className='inline-block w-24'>
                                    {invite.status === 'PENDING' && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
                                    )}
                                    {invite.status === 'ACCEPTED' && (
                                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">Accepted</span>
                                    )}
                                    {invite.status === 'DECLINED' && (
                                        <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">Declined</span>
                                    )}
                                    {invite.status === 'EXPIRED' && (
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">Expired</span>
                                    )}
                                </span>
                                {invite.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="email"
                    placeholder="Invite by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-2 py-1 rounded text-sm flex-grow dark:bg-gray-800 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    disabled={pending}
                >
                    Invite
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </>
    )
}
