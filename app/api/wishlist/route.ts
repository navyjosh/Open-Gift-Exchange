import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

// GET /api/wishlist
export async function GET() {
    const items = await prisma.wishlistItem.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
}

// POST /api/wishlist
export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, link } = body

    if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    const newItem = await prisma.wishlistItem.create({
        data: {
            name,
            link
        }
    })
    return NextResponse.json(newItem)
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