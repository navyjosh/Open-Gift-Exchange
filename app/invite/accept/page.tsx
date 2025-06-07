// app/invite/accept/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AcceptInvitePage() {
    const router = useRouter()
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const acceptInvite = async () => {
            setStatus('processing')

            try {
                const res = await fetch('/api/invite/accept', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to accept invite')
                }

                setStatus('success')
                setMessage('You have successfully joined the gift exchange!')

                // Optionally redirect to exchanges after a delay
                setTimeout(() => router.push('/giftexchanges'), 2000)
            } catch (err: any) {
                setStatus('error')
                setMessage(err.message || 'Something went wrong.')
            }
        }

        acceptInvite()
    }, [router])

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
