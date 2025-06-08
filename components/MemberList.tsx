'use client'

import { useState, useTransition } from 'react'

interface User {
    name: string
    email: string
}

interface Member {
    userId: string
    user: User
    name: string | null
    email: string
    role: 'ADMIN' | 'MEMBER'
}

interface MemberListProps {
    exchange: {
        id: string
        members: Member[]
        currentUserId: string
    }
}

export function MemberList({ exchange }: MemberListProps) {
const [members, setMembers] = useState<Member[]>(exchange.members)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleRevoke = (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return

        startTransition(async () => {
            try {
                const res = await fetch('/api/members/revoke', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        exchangeId: exchange.id,
                    }),
                })

                const data = await res.json()

                if (!res.ok) {
                    setError(data?.error || 'Failed to revoke membership')
                    return
                }

                setMembers((prev) => prev.filter((m) => m.userId !== userId))
            } catch (err) {
                setError('Something went wrong.')
                console.error(err)
            }
        })
    }

    return (
        <div className="mt-4">
            <p className="font-semibold text-sm mb-1">Members:</p>
            {members.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No members yet.</p>
            ) : (
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {members.map((member) => (
                        <li key={member.userId} className="flex justify-between items-center">
                            <div>
                                <span className='inline-block w-20'>
                                    {member.role === 'ADMIN' && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
                                            Admin: 
                                        </span>
                                    )}
                                    {member.role === 'MEMBER' && (
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-800 dark:text-gray-300">
                                            Member: 
                                        </span>
                                    )}
                                </span>{' '}                                
                                {member.user.name || member.email}
                            </div>

                            {exchange.currentUserId !== member.userId && (
                                <button
                                    onClick={() => handleRevoke(member.userId)}
                                    className="text-xs text-red-500 hover:underline"
                                    disabled={pending}
                                >
                                    Remove
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    )
}
