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
    const [showAddItemDialog, setShowAddItemDialog] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemLink, setNewItemLink] = useState('')
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
            const newItem = await createWishlistItem(newItemName, id, newItemLink)
            setItems([newItem, ...items])
            setShowAddItemDialog(false)
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
                <ul className="mt-4 space-y-2 border-t pt-4">
                    {items.length === 0 ? (
                        <li className="text-gray-500 italic text-sm">No items in this wishlist.</li>
                    ) : (
                        items.map((item) => (
                            <li key={item.id} className="flex justify-between border p-2 rounded text-sm"><span>🎁</span>
                                <p className="font-semibold">{item.name}</p>
                                <span className='text-green-500 border-b-1'>$200</span>
                                <div>
                                    
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
                                        setShowAddItemDialog(true)
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

            <Dialog isOpen={showAddItemDialog} onClose={() => setShowAddItemDialog(false)} title="Add Item">
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
                        placeholder="https://"
                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mb-4"
                    />
                    <div className="flex justify-end gap-4">
                        <div className='flex flex-col items-center'>
                            <button
                                type="button"
                                onClick={() => setShowAddItemDialog(false)}
                                className="px-3 py-1 rounded border dark:border-gray-600"
                            >
                                Cancel
                                <span className='text-xs text-gray-500 mt-1 ml-2'>[esc]</span>
                            </button>

                        </div>
                        <div className='flex flex-col items-center'>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                                Add
                                <span className='text-s text-white mt-1 ml-2 font-extrabold'>↵</span>
                            </button>

                        </div>

                    </div>
                </form>
            </Dialog>
        </li>

    )
}
