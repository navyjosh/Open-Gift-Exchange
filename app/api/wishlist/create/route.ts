import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireSession } from '@/lib/auth/session'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

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
                isActive: false,
            },
        })
        return NextResponse.json(wishlist)
    }
    catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002'
        ) {
            return NextResponse.json(
                { error: 'You already have a wishlist with that name.' },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { error: 'Something went wrong creating wishlist' },
            { status: 500 }
        )
    }
}
