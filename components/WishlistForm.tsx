'use client'

import { useState } from "react"
import { useWishlistStore } from "@/lib/wishlistStore"
import { randomUUID } from "crypto"

export default function WishlistForm() {
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const addItem = useWishlistStore((state) => state.addItem)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        addItem({ id: randomUUID(), name, link })
        setName('')
        setLink('')

    }
    return (
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
    )
}