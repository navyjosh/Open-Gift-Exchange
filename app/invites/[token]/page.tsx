'use client'

import { use } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params)
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (!token || status === 'loading') return

        const storeInviteToken = async () => {
            try {
                await fetch('/api/invites/store-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                if (session) {
                    // Optionally auto-process the invite if logged in
                    router.replace('/invite/accept')
                } else {
                    router.replace('/auth/signin')
                }
            } catch (err) {
                console.error('Failed to store invite token:', err)
            }
        }

        storeInviteToken()
    }, [token, session, status, router])

    return (
        <div className="p-6 text-center">
            <p className="text-gray-600">Processing your invitation...</p>
        </div>
    )
}
