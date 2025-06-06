'use client'

import { use } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params) // Unwrap the async params
    const router = useRouter()

    useEffect(() => {
        if (!token) return

        const storeInviteToken = async () => {
            try {
                await fetch('/api/invite/store-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                router.replace('/auth/signin')
            } catch (err) {
                console.error('Failed to store invite token:', err)
            }
        }

        storeInviteToken()
    }, [token, router])

    return (
        <div className="p-6 text-center">
            <p className="text-gray-600">Processing your invitation...</p>
        </div>
    )
}
