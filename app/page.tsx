import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import Link from 'next/link'
import { requireSession } from "@/lib/auth/session"
import { NewWishlistButton } from "../components/NewWishlistButton"
import { WishlistListItem } from "@/components/WishlistListItem"

const prisma = new PrismaClient()

export default async function Home() {
    const session = await requireSession()
    const wishlists = await prisma.wishlist.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            items: true,
        }
    })

    return (
        <main className="p-8 max-w-xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">
                Welcome, {session.user.name ?? 'User'}
            </h1>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Wishlists</h2>
                <NewWishlistButton />
            </div>

            <ul className="space-y-4">
                {wishlists.map((list) => (
                    <WishlistListItem
                        key={list.id}
                        id={list.id}
                        name={list.name}
                        isActive={list.isActive}
                        items={list.items}
                    />
                ))}
            </ul>

        </main>
    )
}
