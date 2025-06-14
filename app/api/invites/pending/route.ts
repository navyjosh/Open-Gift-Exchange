import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
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
    } catch (err) {
        console.error('Error in /api/invites/pending:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
