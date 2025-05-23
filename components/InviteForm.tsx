'use client'

import { useState, useTransition } from 'react'

export function InviteForm({ exchangeId }: { exchangeId: string }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            try {
                const res = await fetch('/api/invites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, exchangeId }),
                })

                if (!res.ok) {
                    const data = await res.json()
                    setError(data?.error || 'Failed to send invite')
                    return
                }

                setEmail('')
            } catch (err) {
                setError('Something went wrong.')
                console.error(err)
            }
        })
    }

    return (
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
    )
}
