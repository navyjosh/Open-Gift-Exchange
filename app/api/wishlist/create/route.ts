import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requireSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const session = await requireSession()

    const { name } = await req.json()

    if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Name is required' }, { status: 401 })
    }
    // make all wishlist inactive 
    // await prisma.wishlist.updateMany({
    //     where: {userId: session.user.id},
    //     data: {isActive: false},
    // })
    

    const wishlist = await prisma.wishlist.create({
        data: {
            name: name.trim(),
            userId: session.user.id,
            isActive: false,
        },        
    })

    return NextResponse.json(wishlist)
}
