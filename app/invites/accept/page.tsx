'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AcceptInvitePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const acceptInvite = async () => {
            setStatus('processing')

            const token = searchParams.get('token') // ← Get ?token=... from URL

            try {
                const res = await fetch('/api/invites/accept', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: token ? JSON.stringify({ token }) : undefined, // only pass if exists
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to accept invite')
                }

                setStatus('success')
                setMessage('You have successfully joined the gift exchange!')

                setTimeout(() => router.push('/exchanges'), 2000)
            } catch (err: any) {
                setStatus('error')
                setMessage(err.message || 'Something went wrong.')
            }
        }

        acceptInvite()
    }, [router, searchParams])

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
            {status === 'processing' && (
                <p className="text-gray-600">Accepting your invitation...</p>
            )}
            {status === 'success' && (
                <p className="text-green-600 font-medium">{message}</p>
            )}
            {status === 'error' && (
                <p className="text-red-600 font-medium">{message}</p>
            )}
        </div>
    )
}
