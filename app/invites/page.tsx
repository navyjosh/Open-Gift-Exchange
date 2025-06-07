// app/invites/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function InvitesPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Please sign in to view invitations.</p>
            </div>
        )
    }

    const invites = await prisma.invite.findMany({
        where: {
            email: session.user.email,
            status: 'PENDING',
        },
        include: {
            exchange: true,
        },
        orderBy: { createdAt: 'desc' },
    })

    if (invites.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">You have no pending invitations.</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Pending Invitations</h1>
            <ul className="space-y-3">
                {invites.map((invite) => (
                    <li key={invite.id} className="border p-4 rounded shadow-sm">
                        <p>
                            <span className="font-semibold">Exchange:</span> {invite.exchange.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Sent on {new Date(invite.createdAt).toLocaleDateString()}
                        </p>
                        <Link
                            href={`/invites/accept?token=${invite.token}`}
                            className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                        >
                            View & Accept →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
