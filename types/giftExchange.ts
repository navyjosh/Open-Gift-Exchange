import { Prisma } from '@prisma/client'

export type GiftExchangeWithMembersAndInvites = Prisma.GiftExchangeGetPayload<{
    select: {
        id: true
        name: true
        description: true
        maxSpend: true
        date: true
        time: true
        address: true
        createdAt: true
        updatedAt: true
        members: {
            select: {
                id: true
                userId: true
                role: true
                assignedToId: true
                assignedTo: true
                user: {
                    select: {
                        id: true
                        name: true
                        email: true
                    }
                }
            }
        }
        invites: {
            select: {
                id: true
                email: true
                createdAt: true
                status: true
            }
        }
    }
}>

export type GiftExchangeMemberWithUser = Prisma.GiftExchangeMemberGetPayload<{
    select: {
        id: true
        userId: true
        role: true
        assignedToId: true
        assignedTo: true
        user: {
            select: {
                id: true
                name: true
                email: true
            }
        }
    }
}>

export type InviteListType = Prisma.InviteGetPayload<{
    select: {
        id: true
        email: true
        createdAt: true
        status: true
    }
}>
