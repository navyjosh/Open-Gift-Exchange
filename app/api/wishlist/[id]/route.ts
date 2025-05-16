import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findUnique({
        where: { id: params.id },
    })

    if (!wishlist || wishlist.userId !== session.user.id) {
        return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 })
    }

    await prisma.wishlist.delete({
        where: { id: params.id },
    })

    return NextResponse.json({ success: true })
}
