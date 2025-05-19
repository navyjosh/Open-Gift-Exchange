'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { deleteWishlist } from '@/lib/api'
import { Trash2, Plus, PaperclipIcon, Paperclip, Link, Link2, Link2Icon, LinkIcon, Link2OffIcon, LucideLink2Off } from 'lucide-react'
import { createWishlistItem } from '@/lib/api'
import { Dialog } from '@/components/Dialog'
import { motion, AnimatePresence } from 'framer-motion'

interface WishlistItem {
    id: string
    name: string
    link?: string | null
    price?: number | null
    notes?: string | null
}

interface WishlistListItemProps {
    id: string
    name: string
    isActive: boolean
    items: WishlistItem[]
}

export function WishlistListItem({ id, name, isActive, items: initialItems }: WishlistListItemProps) {
    const router = useRouter()
    const [expanded, setExpanded] = useState(false)
    const [deleting, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [newItemName, setNewItemName] = useState('')
    const [newItemLink, setNewItemLink] = useState('')
    const [newItemPrice, setNewItemPrice] = useState('')
    const [newItemNotes, setNewItemNotes] = useState('')
    const [items, setItems] = useState<WishlistItem[]>(initialItems)

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
        setError(null)

        try {
            const newItem = await createWishlistItem(newItemName, id, newItemLink, parseFloat(newItemPrice), newItemNotes)
            setItems([newItem, ...items])

            setNewItemName('')
            setNewItemLink('')
            console.log('Creating Item:', newItemName, newItemLink)
        } catch (err) {
            console.error("Failed to create item:", err)
            setError('Failed to add item.')
        }

    }

    return (
        <li className={`border rounded p-4 transition-colors ${expanded ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400'
            }`}>
            {/* Header Row */}
            <div
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {/* left side */}
                <div>
                    <p className="font-medium">{name}</p>
                    {isActive && <span className="text-green-600 text-sm">Active</span>}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(e)
                        }}
                        disabled={deleting}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                className={`trasition-all overflow-hidden ${expanded ? 'max-h-[1000px] opacity-100 mt-4'
                    : 'max-h-0 opacity-0'} duration-200 ease`}
            >
                <ul className="w-full mt-4 space-y-2 border-t pt-4 list-none">
                    {items.length === 0 ? (
                        <li className="text-gray-500 italic text-sm">No items in this wishlist.</li>
                    ) : (
                        items.map((item) => (
                            <li key={item.id} className="flex justify-between border p-2 rounded text-sm">
                                <div className='space-x-4'>
                                    <span>🎁</span>
                                    <span className="font-semibold">{item.name}</span>
                                </div>
                                <div className='flex space-x-4 align-middle'>
                                    {item.price && (
                                        <span className='text-green-500'>${item.price.toFixed(2)}</span>
                                    )}

                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline text-xs"
                                        >
                                            <LinkIcon className='h-4' />
                                        </a>
                                    )}
                                    {!item.link && (
                                        <LucideLink2Off className='h-4' />
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleNewItemSubmit(e)
                        }}
                    >
                        <li className="border p-2 rounded flex flex-col gap-1">
                            <label htmlFor="name" className="text-xs text-gray-500">Item name</label>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Item name"
                                required
                                className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                            />
                            {newItemName.trim() !== '' && (
                                <>
                                    <label htmlFor="link" className="text-xs text-gray-500">Link (optional)</label>
                                    <input
                                        type="url"
                                        value={newItemLink}
                                        onChange={(e) => setNewItemLink(e.target.value)}
                                        placeholder="https:// (optional link)"
                                        className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                    />

                                    <label htmlFor={`price-${id}`} className="text-xs text-gray-500">Price (optional)</label>
                                    <input
                                        id={`price-${id}`}
                                        type="number"
                                        step="0.01"
                                        value={newItemPrice}
                                        onChange={(e) => setNewItemPrice(e.target.value)}
                                        placeholder="$0.00"
                                        className="w-full border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                    />

                                    <label htmlFor={`notes-${id}`} className="text-xs text-gray-500">Notes (optional)</label>
                                    <textarea
                                        id={`notes-${id}`}
                                        value={newItemNotes}
                                        onChange={(e) => setNewItemNotes(e.target.value)}
                                        placeholder="e.g. Color, size, store..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.ctrlKey) {
                                                e.preventDefault()
                                                handleNewItemSubmit(e)
                                            }
                                        }}
                                        className="w-full border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                    />
                                    <div className='flex justify-end'>
                                    <button
                                        type="submit"
                                        className="w-fit flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Add
                                        <span className="text-xs">↵</span>
                                    </button>
                                    </div>
                                </>
                            )}
                        </li>

                        <button type="submit" className="hidden" aria-hidden="true" />
                    </form>
                </ul>

                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            key="expanded-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >


                            {/* ➕ Add Item button at bottom of list */}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()

                                    }}
                                    title="Add Item"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    🎁
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </li >

    )
}
