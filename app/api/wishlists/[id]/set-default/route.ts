import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/auth/session'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await requireSession()
    const { id } = await params

    // Confirm the wishlist belongs to the current user
    const wishlist = await prisma.wishlist.findUnique({
        where: { id },
        select: { userId: true },
    })

    if (!wishlist || wishlist.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Set as default
    await prisma.user.update({
        where: { id: session.user.id },
        data: { defaultWishlistId: id },
    })

    return NextResponse.json({ success: true })
}
