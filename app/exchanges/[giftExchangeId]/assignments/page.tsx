'use client'

import { useState, useTransition } from 'react'
import { useParams } from 'next/navigation'

interface Member {
    id: string
    user: { name: string | null }
    assignedTo?: { user: { name: string | null } }
}

export default function AssignmentsPage() {
    const { id: exchangeId } = useParams() as { id: string }
    const [members, setMembers] = useState<Member[]>([])
    const [loading, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)    

    const fetchAssignments = async () => {
        setError(null)
        try {
            const res = await fetch(`/api/exchanges/${exchangeId}/members`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to load members')
            setMembers(data.members)
        } catch (err) {
            setError(`${err}`)
        }
    }

    const assignSecretSantas = async () => {
        setError(null)
        startTransition(async () => {
            try {
                const res = await fetch(`/api/exchanges/${exchangeId}/assign`, {
                    method: 'POST',
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Assignment failed')
                fetchAssignments() // Refresh the list
            } catch (err) {
                setError(`${err}`)
            }
        })
    }

    const clearSecretSantas = async () => {
        setError(null)
        startTransition(async () => {
            try {
                const res = await fetch(`/api/exchanges/${exchangeId}/clear`, {
                    method: 'POST',
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Clear failed')
                fetchAssignments() // Refresh the list
            } catch (err) {
                setError(`${err}`)
            }
        })
    }    

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Secret Santa Assignments</h1>

            <button
                onClick={assignSecretSantas}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Assigning...' : 'Randomly Assign Secret Santas'}
            </button>

            <button
                onClick={clearSecretSantas}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Clearing...' : 'Cleared Secret Stantas'}
            </button>

            {error && <p className="text-red-600">{error}</p>}

            <ul className="mt-6 space-y-2">
                {members.map((member) => (
                    <li
                        key={member.id}
                        className="p-3 border rounded shadow-sm bg-white dark:bg-gray-800 dark:text-white"
                    >
                        🎅 <strong>{member.user.name || '(No name)'}</strong> →{' '} 
                        {member.assignedTo?.user.name || 'Not assigned yet'} 🎁
                    </li>
                ))}
            </ul>
        </div>
    )
}
