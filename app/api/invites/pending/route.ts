import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await requireSession()

    if (!session.user.email) {
        return NextResponse.json({ error: 'Missing user email' }, { status: 400 })
    }

    const invites = await prisma.invite.findMany({
        where: {
            email: session.user.email,
            status: 'PENDING',
        },
        select: { id: true },
    })

    return NextResponse.json({ count: invites.length })
}
