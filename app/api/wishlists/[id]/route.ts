import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
        return NextResponse.json({ error: 'Missing ID in URL' }, { status: 400 })
    }

    const wishlist = await prisma.wishlist.findUnique({
        where: { id },
        include: {
            user: true, // We need access to defaultWishlistId
        },
    })

    if (!wishlist || wishlist.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
    }

    // Prevent deleting the default wishlist
    if (wishlist.user.defaultWishlistId === wishlist.id) {
        return NextResponse.json({
            error: 'You cannot delete your default wishlist. Please assign another wishlist as default first.',
        }, { status: 400 })
    }

    await prisma.wishlist.delete({
        where: { id },
    })

    return NextResponse.json({ success: true })
}
