'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/Dialog'
import { createGiftExchange } from '@/lib/api'

export function NewGiftExchangeButton() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const handleSubmit = () => {
        if (!name.trim()) return

        startTransition(async () => {
            try {
                await createGiftExchange({ name: name.trim() })
                setName('')
                setOpen(false)
                router.refresh()
            } catch {
                setError('Failed to create gift exchange')
            }
        })
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
                + New Exchange
            </button>

            <Dialog
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Create Gift Exchange"
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
                        placeholder="Exchange name"
                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mb-4"
                        autoFocus
                    />

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-3 py-1 rounded border dark:border-gray-600"
                            >
                                Cancel
                                <span className="text-xs text-gray-500 mt-1 ml-2">[esc]</span>
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                disabled={pending || !name.trim()}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                                {pending ? 'Creating...' : 'Create'}
                                <span className="text-s text-white mt-1 ml-2 font-extrabold">↵</span>
                            </button>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    )
}
