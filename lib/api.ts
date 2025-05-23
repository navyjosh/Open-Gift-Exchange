


export async function getWishlistItems() {
    const res = await fetch('/api/wishlist/item')
    if (!res.ok) throw new Error('Failed to fetch wishlist')
    return res.json()
}

export async function createWishlistItem(
    name: string,
    wishlistId: string,
    link?: string,
    price?: number,
    notes?: string
) {
    const res = await fetch('/api/wishlist/item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, link, wishlistId, price, notes }),
    })

    if (!res.ok) throw new Error('Failed to create wishlist item')
    return res.json()
}

export async function deleteItem(id: string) {
    const res = await fetch(`/api/wishlist/item/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })

    if (!res.ok) throw new Error('Failed to delete wishlist item')
    return res.json()
}

export async function createNewWishlist(name: string) {
    const res = await fetch('/api/wishlist/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    })
    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || 'Failed to create wishlist')
    }
    return data
}

export async function deleteWishlist(id: string) {
    const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) throw new Error('Failed to delete wishlist')
    return res.json()
}

export async function deleteGiftExchange(id: string) {
    const res = await fetch(`/api/giftexchange/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete Gift Exchange')
    return res.json()

}

export async function createGiftExchange(data: {
    name: string
    description?: string
    maxSpend?: number
    date?: string
    time?: string
    address?: string
}) {
    const res = await fetch('/api/giftexchange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to create gift exchange')
    }

    return res.json()
}
