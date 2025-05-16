'use client'

import { useState } from 'react'
import { createWishlistItem } from '@/lib/api'

interface WishlistItem {
    id: string
    name: string
    link?: string | null
}

interface Wishlist {
    id: string
    name: string
    items: WishlistItem[]
}

export default function WishlistClient({ wishlist }: { wishlist: Wishlist }) {
    const [items, setItems] = useState<WishlistItem[]>(wishlist.items)
    const [name, setName] = useState('')
    const [link, setLink] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        try {
            const newItem = await createWishlistItem(name, link, wishlist.id)
            setItems([newItem, ...items])
            setName('')
            setLink('')
        } catch (err) {
            console.error('Failed to add item:', err)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                    required
                    className="border p-2 w-full rounded"
                />
                <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Optional link"
                    className="border p-2 w-full rounded"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add to Wishlist
                </button>
            </form>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-4 rounded">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
