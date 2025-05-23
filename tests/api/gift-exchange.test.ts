/**
 * @jest-environment node
 */
import { POST } from '@/app/api/giftexchange/route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

// Mock requireSession
jest.mock('@/lib/auth/session', () => ({
    requireSession: jest.fn(() => Promise.resolve({ user: { id: 'user123' } })),
}))

// Optional: mock prisma for isolation
jest.mock('@/lib/prisma', () => ({
    prisma: {
        giftExchange: {
            create: jest.fn(),
        },
    },
}))

describe('POST /api/giftexchange', () => {
    it('creates a new gift exchange and returns it', async () => {
        const body = {
            name: 'Holiday Gift Swap',
            description: 'Annual team exchange',
            maxSpend: 50,
            date: '2025-12-01',
            time: '6:00 PM',
            address: '123 Festive Lane',
        }

        const mockExchange = {
            id: 'exchange123',
            name: body.name,
            description: body.description,
            maxSpend: body.maxSpend,
            date: new Date(body.date),
            time: body.time,
            address: body.address,
            createdAt: new Date(),
            updatedAt: new Date(),
            members: [
                {
                    userId: 'user123',
                    role: 'ADMIN',
                },
            ],
        }


        const createMock = (prisma.giftExchange.create) as jest.MockedFunction<PrismaClient['giftExchange']['create']>;



        createMock.mockResolvedValue(mockExchange)

        const req = new NextRequest('http://localhost/api/giftexchange', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Holiday Gift Swap',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.name).toBe('Holiday Gift Swap')
        expect(prisma.giftExchange.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    name: 'Holiday Gift Swap',
                    members: {
                        create: { userId: 'user123', role: 'ADMIN' },
                    },
                }),
            })
        )
    })
})
