// app/invite/[token]/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InvitePage({ params }: { params: { token: string } }) {
    const router = useRouter()
    const token = params.token

    useEffect(() => {
        if (!token) return

        const storeInviteToken = async () => {
            try {
                await fetch('/api/invite/store-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                // Redirect after token is stored
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
