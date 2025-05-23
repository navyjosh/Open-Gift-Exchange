'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/Dialog'
import { createGiftExchange } from '@/lib/api'

export function NewGiftExchangeButton() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [maxSpend, setMaxSpend] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [address, setAddress] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const handleSubmit = () => {
        if (!name.trim()) return

        startTransition(async () => {
            try {
                await createGiftExchange({
                    name: name.trim(),
                    description: description.trim() || null,
                    maxSpend: maxSpend ? parseFloat(maxSpend) : null,
                    date: date ? new Date(date) : null,
                    time: time.trim() || null,
                    address: address.trim() || null,
                })
                setName('')
                setDescription('')
                setMaxSpend('')
                setDate('')
                setTime('')
                setAddress('')
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
                    className="space-y-4"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Exchange name"
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                        required
                        autoFocus
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                    />

                    <input
                        type="number"
                        step="0.01"
                        value={maxSpend}
                        onChange={(e) => setMaxSpend(e.target.value)}
                        placeholder="Max spend (e.g., 50.00)"
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                    />

                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                    />

                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address (optional)"
                        className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-3 py-1 rounded border dark:border-gray-600"
                        >
                            Cancel <span className="text-xs text-gray-500 ml-2">[esc]</span>
                        </button>
                        <button
                            type="submit"
                            disabled={pending || !name.trim()}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            {pending ? 'Creating...' : 'Create'} <span className="text-xs ml-2">↵</span>
                        </button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}
