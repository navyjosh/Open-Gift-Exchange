'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    useEffect(() => {
        if (!token) return setStatus('error')

        const verify = async () => {
            const res = await fetch('/api/auth/verify/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })

            if (res.ok) {
                setStatus('success')
                setTimeout(() => router.push('/wishlists'), 2000)
            } else {
                setStatus('error')
            }
        }

        verify()
    }, [token, router])

    return (
        <div className="max-w-md mx-auto mt-20 text-center">
            {status === 'verifying' && <p>Verifying your email...</p>}
            {status === 'success' && <p className="text-green-600">Email verified! Redirecting...</p>}
            {status === 'error' && <p className="text-red-600">Verification failed or link expired.</p>}
        </div>
    )
}
