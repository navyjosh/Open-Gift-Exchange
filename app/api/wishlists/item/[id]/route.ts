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
    console.log(`wishlistItemId: ${id}`)

    const wishlistItem = await prisma.wishlistItem.findUnique({
        where: { id },
        include: {
            wishlist: {
                select: {
                    userId: true,
                },
            },
        },
    })
    console.log(`wishlistItem: ${wishlistItem}`)
    console.log(`wishlistItem.wishlist: ${wishlistItem?.wishlist}`)

    // Check if item exists and belongs to the user
if (!wishlistItem || wishlistItem.wishlist.userId !== session.user.id) {

        
        return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
    }

    await prisma.wishlistItem.delete({
        where: { id },
    })

    return NextResponse.json({ success: true })
}
