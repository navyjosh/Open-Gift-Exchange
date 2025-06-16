import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { addMinutes } from 'date-fns'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
            emailVerified: null,
        },
    })

    await prisma.account.create({
        data: {
            userId: user.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.email,
        },
    })

    // Generate verification token
    const token = randomBytes(32).toString('hex')
    const expires = addMinutes(new Date(), 60) // 1 hour

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`

    // Send verification email
    try {
        await sendWelcomeEmail({
            to: email,
            name: name,
            verifyUrl: verifyUrl,
            sendVerificationLink: true
        })
    } catch (error) {
        console.error('Failed to send verification email:', error)
        // We still allow the user to register
    }

    return NextResponse.json({ id: user.id, email: user.email })
}
