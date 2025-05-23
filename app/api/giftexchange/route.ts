import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await requireSession()
    const userId = session.user.id

    const body = await req.json()
    const {
        name,
        description,
        maxSpend,
        date,
        time,
        address,
    } = body

    if (!name || typeof name !== 'string') {
        return NextResponse.json({
            error: 'Name is required'
        }, { status: 400 })
    }

    try {
        const exchange = await prisma.giftExchange.create({
            data: {
                name,
                description,
                maxSpend,
                date: date ? new Date(date) : undefined,
                time,
                address,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                members: true,
            },
        })

        return NextResponse.json(exchange)
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Failed to create gift exchange' }, { status: 500 })
    }
}