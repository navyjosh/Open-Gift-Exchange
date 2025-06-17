// app/exchanges/[giftExchangeId]/members/[memberId]/wishlist/page.tsx
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function MemberWishlistPage({
    params,
}: {
    params: Promise<{ giftExchangeId: string; memberId: string }>
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {        
        notFound()
    }

    const { giftExchangeId, memberId } = await params

    // Verify that current user is part of this exchange
    const viewerMembership = await prisma.giftExchangeMember.findUnique({
        where: {
            userId_giftExchangeId: {
                userId: session.user.id,
                giftExchangeId,
            },
        },
    })

    if (!viewerMembership) {        
        notFound()
    }

    // Get the member and their wishlist (if any)
    const member = await prisma.giftExchangeMember.findUnique({
        where: { id: memberId },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            wishlist: {
                include: {
                    items: true,
                },
            },
        },
    })

    if (!member) {
        notFound()
    }

    let wishlist = member.wishlist

    if (!wishlist) {
        // Try fetching the default wishlist for this member's user
        const defaultWishlist = await prisma.wishlist.findUnique({
            where: {
                id: member.userId, // member.userId doesn't exist on `member.user`, we need to fetch it from GiftExchangeMember
            },
            include: {
                items: true,
            },
        })
        if (!defaultWishlist) {
            // fallback to user's defaultWishlist
            const user = await prisma.user.findUnique({
                where: { id: member.userId },
                select: { defaultWishlistId: true },
            })

            if (!user?.defaultWishlistId) {
                return <p>This user has no wishlist</p>
            }

            wishlist = await prisma.wishlist.findUnique({
                where: { id: user.defaultWishlistId },
                include: { items: true },
            })
        }
        if (!wishlist) {
            return <p>This person doesn&apos;t have a wishlist yet. Poke them!</p>
        }

    }

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">{member.user.name}&apos;s Wishlist</h1>

            {wishlist.items.length === 0 ? (
                <p className="text-gray-600 italic">No items on this wishlist.</p>
            ) : (
                <ul className="space-y-4">
                    {wishlist.items.map((item) => (
                        <li key={item.id} className="border p-4 rounded shadow-sm">
                            <p className="font-semibold">{item.name}</p>
                            {item.price && (
                                <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                            )}
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm underline"
                                >
                                    View item
                                </a>
                            )}
                            {item.notes && <p className="text-sm mt-1 text-gray-500">{item.notes}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
