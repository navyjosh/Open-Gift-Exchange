import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/session'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'


export async function POST(req: NextRequest) {
    const session = await requireSession()
    const { name } = await req.json()

    if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Name is required' }, { status: 401 })
    }

    try {
        const wishlist = await prisma.wishlist.create({
            data: {
                name: name.trim(),
                userId: session.user.id,
            },
        })

        // Check if the user already has a default wishlist
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { defaultWishlistId: true },
        })

        // If not, assign the new wishlist as the default
        if (!user?.defaultWishlistId) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { defaultWishlistId: wishlist.id },
            })
        }

        return NextResponse.json(wishlist)
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002'
        ) {
            return NextResponse.json(
                { error: 'You already have a wishlist with that name.' },
                { status: 409 }
            )
        }

        console.error('Wishlist creation error:', err)
        return NextResponse.json(
            { error: 'Something went wrong creating wishlist' },
            { status: 500 }
        )
    }
}
