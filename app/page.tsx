'use client'

import { useEffect, useState } from 'react'
import { getWishlistItems, createWishlistItem, deleteWishlistItem } from '@/lib/api'

interface WishlistItem {
    id: string
    name: string
    link?: string
}

export default function Home() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [link, setLink] = useState('')

    useEffect(() => {
        getWishlistItems()
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        try {
            const newItem = await createWishlistItem(name, link)
            console.log('new item:', newItem)
            setItems([newItem, ...items])
            setName('')
            setLink('')
        } catch (err) {
            console.error('Failed to add item:', err)
        }
    }
    return (
        <main className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full rounded"
                    required
                />
                <input
                    type="url"
                    placeholder="Optional link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add to Wishlist
                </button>
            </form>

            <div className="mt-6">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-gray-500">Your wishlist is empty.</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="border p-4 rounded mb-2">
                            <div>
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
                            <button
                                onClick={async () => {
                                    try {
                                        console.log('Deleting item with id:', item.id)
                                        await deleteWishlistItem(item.id)
                                        setItems(items.filter((i) => i.id !== item.id))
                                    } catch (err) {
                                        console.error('Failed to delete item:', err)
                                    }
                                }}
                                className="text-red-600 hover:underline ml-4"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </main >
    )
}
