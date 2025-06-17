import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await requireSession()
    const { id: wishlistIdToDelete } = await params

    if (!wishlistIdToDelete) {
        return NextResponse.json({ error: 'Invalid wishlistId' }, { status: 400 })
    }

    try {
        // Fetch user's default wishlist ID
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { defaultWishlistId: true },
        })
        if (!user) {
            return NextResponse.json({ error: 'Could not find user.' }, { status: 500 })
        }
        if (user.defaultWishlistId === wishlistIdToDelete) {
            return NextResponse.json({ error: "You can't delete your default wishlist" }, { status: 401 } )
        }

        // Delete the wishlist
        await prisma.wishlist.delete({
            where: {
                id: wishlistIdToDelete,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting wishlist:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
