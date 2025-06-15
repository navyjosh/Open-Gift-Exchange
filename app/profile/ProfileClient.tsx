'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import toast from 'react-hot-toast'
import { User } from '@prisma/client'

export function ProfileClient({ user }: { user: User }) {
    const [loading, setLoading] = useState(false)

    const resendEmail = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/auth/verify/resend', { method: 'POST' })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to send email')

            toast.success('Verification email sent!')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-12 px-4">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <div className="bg-white dark:bg-gray-800 shadow rounded p-6 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user.name || 'No name provided'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email Verified</p>
                    <p className="font-medium">
                        {user.emailVerified ? 'Yes' : 'No'}
                    </p>

                    {user.emailVerified === null && (
                        <Button
                            onClick={resendEmail}
                            className="mt-2 text-sm"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Resend Verification Email'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
