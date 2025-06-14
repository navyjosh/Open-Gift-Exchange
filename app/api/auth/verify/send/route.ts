// /api/auth/verify/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { randomBytes } from 'crypto'
import { addMinutes } from 'date-fns'

export async function POST(req: NextRequest) {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const token = randomBytes(32).toString('hex')
    const expires = addMinutes(new Date(), 60) // 1 hour expiration

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`

    await sendVerificationEmail(email, verifyUrl)

    return NextResponse.json({ success: true })
}
