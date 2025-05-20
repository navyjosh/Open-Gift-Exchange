import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({ id: user.id, email: user.email })
}
