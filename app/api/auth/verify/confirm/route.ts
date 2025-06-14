import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { token } = await req.json()

    const record = await prisma.verificationToken.findUnique({
        where: { token },
    })

    if (!record || record.expires < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    await prisma.user.update({
        where: { email: record.identifier },
        data: { emailVerified: new Date() },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ success: true })
}
