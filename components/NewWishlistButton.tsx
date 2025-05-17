'use client'

import { useState, useTransition } from 'react'
import { createNewWishlist } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/Dialog'

export function NewWishlistButton() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const handleSubmit = () => {
        if (!name.trim()) return

        startTransition(async () => {
            try {
                await createNewWishlist(name.trim())
                setName('')
                setOpen(false)
                router.refresh()
            } catch {
                setError('Failed to create wishlist')
            }
        })
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
                + New Wishlist
            </button>
            <Dialog 
                isOpen={open} 
                onClose={() => setOpen(false)}
                title='Create Wishlist'
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Wishlist name"
                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mb-4"
                        autoFocus
                    />

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-3 py-1 rounded border dark:border-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending || !name.trim()}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            {pending ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </Dialog>

        </>
    )
}
