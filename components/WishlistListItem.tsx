'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { deleteWishlist } from '@/lib/api'
import { Trash2, Plus } from 'lucide-react'

interface WishlistItem {
    id: string
    name: string
    link?: string | null
}

interface WishlistListItemProps {
    id: string
    name: string
    isActive: boolean
    items: WishlistItem[]
}

export function WishlistListItem({ id, name, isActive, items }: WishlistListItemProps) {
    const router = useRouter()
    const [expanded, setExpanded] = useState(false)
    const [deleting, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemLink, setNewItemLink] = useState('')

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm(`Delete "${name}"?`)) return

        startTransition(async () => {
            try {
                await deleteWishlist(id)
                router.refresh()
            } catch {
                setError('Failed to delete')
            }
        })
    }

    const handleNewItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Creating Item:', newItemName, newItemLink)
        setShowDialog(false)
        setNewItemName('')
        setNewItemLink('')
    }

    return (
        <li
            className="border p-4 rounded flex items-center justify-between"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-center w-full">
                <div>
                    <p className="font-medium">{name}</p>
                    {isActive && <span className="text-green-600 text-sm">Active</span>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowDialog(true)}
                        title="Add Item"
                        className='text-blue-500 hover:text-blue-700'
                    >
                        <Plus className='w-4 h-4' />
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className='w-4 h-4' />
                    </button>
                </div>
            </div>
            {expanded && (
                <ul className="mt-4 space-y-2 border-t pt-4">
                    {items.length === 0 ? (
                        <li className="text-gray-500 italic text-sm">No items in this wishlist.</li>
                    ) : (
                        items.map((item) => (
                            <li key={item.id} className="border p-2 rounded text-sm">
                                <p className="font-semibold">{item.name}</p>
                                {item.link && (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline text-xs"
                                    >
                                        View Link
                                    </a>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            )}
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div
                        className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded shadow-lg w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">Add Item</h2>
                        <form onSubmit={handleNewItemSubmit}>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Item name"
                                required
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mb-4"
                            />
                            <input
                                type="url"
                                value={newItemLink}
                                onChange={(e) => setNewItemLink(e.target.value)}
                                placeholder="Optional link"
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mb-4"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDialog(false)}
                                    className="px-3 py-1 rounded border dark:border-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </li>
    )
}
