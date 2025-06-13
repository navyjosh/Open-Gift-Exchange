import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isUserAdminOfExchange } from '@/lib/exchanges/permission'


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const url = new URL(req.url)
    const giftExchangeId = url.pathname.split('/').pop()


    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })
    if (!giftExchangeId) {
        return NextResponse.json({ error: 'Missing ID in URL' }, { status: 400 })
    }
    const isAdmin = await isUserAdminOfExchange(session.user.id, giftExchangeId)
    if (!isAdmin) return new Response("Forbidden", { status: 403 })

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await prisma.giftExchange.delete({
        where: { id: giftExchangeId },
    })

    return NextResponse.json({ success: true })
}
