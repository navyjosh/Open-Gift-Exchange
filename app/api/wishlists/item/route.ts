import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { name, link, wishlistId, price, notes } = await req.json()

    if (!name || !wishlistId) {
        return NextResponse.json({ error: 'Name and wishlistId are required' }, { status: 400 })
    }

    try {
        const newItem = await prisma.wishlistItem.create({
            data: {
                name,
                link,
                wishlistId,
                price: price ? parseFloat(price) : undefined,
                notes,
            },
        })

        return NextResponse.json(newItem)
    } catch (error) {
        console.error('Failed to create wishlist item:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function GET() {
    const items = await prisma.wishlistItem.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json()

    if (!id || typeof id !== 'string') {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    try {
        await prisma.wishlistItem.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete item:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}