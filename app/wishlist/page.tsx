import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WishlistClient from './WishlistClient'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function WishlistPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/api/auth/signin')
    }

    const wishlist = await prisma.wishlist.findFirst({
        where: {
            userId: session.user.id,
            isActive: true,
        },
        include: {
            items: true,
        },
    })
    

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">
                {session.user.name ? `Welcome, ${session.user.name}` : 'Your Wishlist'}
            </h1>
            <WishlistClient wishlist={wishlist} />
        </main>
    )
}
