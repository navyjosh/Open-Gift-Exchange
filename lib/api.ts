import { NextRequest, NextResponse } from "next/server"


export async function getWishlistItems() {
    const res = await fetch('/api/wishlist')
    if (!res.ok) throw new Error('Failed to fetch wishlist')
    return res.json()
}

export async function createWishlistItem(name: string, link?: string) {
    const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, link }),
    })

    if (!res.ok) throw new Error('Failed to create wishlist item')
    return res.json()
}

export async function deleteWishlistItem(id: string) {
    const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })

    if (!res.ok) throw new Error('Failed to delete wishlist item')
    return res.json()
}