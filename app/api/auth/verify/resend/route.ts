import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (!user || user.emailVerified) {
        return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=...` // ← Replace with real token logic

    await sendVerificationEmail({
        to: user.email,
        name: user.name ?? undefined,
        verifyUrl,
        sendVerificationLink: true,
    })

    return NextResponse.json({ message: 'Verification email sent' })
}
