'use client'
import { useEffect } from 'react'
import { useRef } from 'react'
import { LucideLink2Off, LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { createWishlistItem } from '@/lib/api'
import { deleteItem } from '@/lib/api'
import { ExpandableCard } from '@/components/ExpandableCard'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreVertical } from 'lucide-react'

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
    defaultWishlistId?: string
    items: WishlistItem[]
}

export function WishlistListItem({ id, name, defaultWishlistId, items: initialItems }: WishlistListItemProps) {
    const router = useRouter()
    const [expanded, setExpanded] = useState(false)
    const [deleting, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [newItemName, setNewItemName] = useState('')
    const [newItemLink, setNewItemLink] = useState('')
    const [newItemPrice, setNewItemPrice] = useState('')
    const [newItemNotes, setNewItemNotes] = useState('')
    const [items, setItems] = useState<WishlistItem[]>(initialItems)

    const nameInputRef = useRef<HTMLInputElement>(null)
    const prevExpandedRef = useRef(false)

    const handleDeleteWishlist = (name: string) => {
        if (!confirm(`Delete "${name}"?`)) return

        startTransition(async () => {
            try {
                const res = await fetch(`/api/wishlists/${id}`, { method: 'DELETE' })
                if (!res.ok) {
                    const data = await res.json()
                    setError(data.error || 'Failed to delete wishlist')
                    return
                }
                router.refresh()
            } catch {
                setError('Failed to delete wishlist')
            }

        })
    }

    const handleDeleteItem = (itemId: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return

        startTransition(async () => {
            try {
                await deleteItem(itemId)
                setItems((prev) => prev.filter((item) => item.id !== itemId))
            } catch {
                setError('Failed to delete item')
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
            nameInputRef.current?.focus()

        } catch (err) {

            setError('Failed to add item.')
        }

    }
    useEffect(() => {
        if (expanded && !prevExpandedRef.current) {
            nameInputRef.current?.focus()
        }

        prevExpandedRef.current = expanded
    }, [expanded])

    return (

        <ExpandableCard
            onExpand={() => nameInputRef.current?.focus()}
            header={
                <>
                    <div>
                        <p className="font-medium flex items-center gap-2">
                            {name}
                            {defaultWishlistId === id && (<span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-2">Default</span>)
                            }
                        </p>

                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-500 hover:text-gray-700 p-2"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    sideOffset={4}
                                    className="z-50 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md text-sm"
                                >
                                    <DropdownMenu.Item
                                        onSelect={async () => {
                                            try {
                                                await fetch(`/api/wishlists/${id}/set-default`, { method: 'POST' })
                                                router.refresh()
                                            } catch (err) {
                                                console.error('Failed to set default wishlist')
                                            }
                                        }}
                                        className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-pointer"
                                    >
                                        Set as Default
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        onSelect={handleDeleteWishlist}
                                        className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                                    >
                                        Delete
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </>
            }
        >
            <ul className="space-y-2">
                {items.length === 0 ? (
                    <li className="text-gray-500 italic text-sm">No items yet.</li>
                ) : (
                    items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between border p-2 rounded text-sm">
                            <div className="space-x-2">
                                <span>🎁</span>
                                <span className="font-semibold">{item.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {item.price && <span className="text-green-500">${item.price.toFixed(2)}</span>}
                                {item.link ? (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline text-xs"
                                    >
                                        <LinkIcon className="h-4" />
                                    </a>
                                ) : (
                                    <LucideLink2Off className="h-4" />
                                )}

                                <div className="flex gap-2">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-gray-500 hover:text-gray-700 p-2"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                sideOffset={4}
                                                className="z-50 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md text-sm"
                                            >
                                                <DropdownMenu.Item
                                                    onSelect={() => handleDeleteItem(item.id, item.name)}
                                                    className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                                                >
                                                    Delete
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </div>
                            </div>
                        </li>
                    ))
                )}
                <form onSubmit={handleNewItemSubmit}>
                    <li className="border p-2 rounded flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Item name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Item name"
                            className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                        />

                        {newItemName.trim() !== '' && (
                            <>
                                <label className="text-xs text-gray-500">Link (optional)</label>
                                <input
                                    type="url"
                                    value={newItemLink}
                                    onChange={(e) => setNewItemLink(e.target.value)}
                                    placeholder="https://..."
                                    className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                />

                                <label className="text-xs text-gray-500">Price (optional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(e.target.value)}
                                    placeholder="$0.00"
                                    className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                />

                                <label className="text-xs text-gray-500">Notes (optional)</label>
                                <textarea
                                    value={newItemNotes}
                                    onChange={(e) => setNewItemNotes(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.ctrlKey) handleNewItemSubmit(e)
                                    }}
                                    className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Add <span className="text-xs">↵</span>
                                    </button>
                                </div>
                            </>
                        )}


                    </li>
                </form>
            </ul>
        </ExpandableCard>
    )
}