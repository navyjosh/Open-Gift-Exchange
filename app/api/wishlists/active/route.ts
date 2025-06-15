import { NextResponse } from 'next/server'

import {prisma} from '@/lib/prisma'

// Replace with actual auth logic later
const DUMMY_USER_ID = 'cmar0r2780000zvp8n3v09g3s'

export async function GET() {
    try {
        const wishlist = await prisma.wishlist.findFirst({
            where: {
                userId: DUMMY_USER_ID,                
            },
        })

        if (!wishlist) {
            return NextResponse.json({ error: 'No active wishlist found' }, { status: 404 })
        }

        return NextResponse.json(wishlist)
    } catch (err) {
        console.error('Error fetching active wishlist:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
