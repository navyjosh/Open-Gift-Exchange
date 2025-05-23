// lib/giftExchange/permissions.ts

import { prisma } from '@/lib/prisma'

export async function isUserAdminOfExchange(userId: string, exchangeId: string) {
    const membership = await prisma.giftExchangeMember.findUnique({
        where: {
            userId_giftExchangeId: {
                userId,
                giftExchangeId: exchangeId,
            },
        },
        select: {
            role: true,
        },
    })

    return membership?.role === 'ADMIN'
}
