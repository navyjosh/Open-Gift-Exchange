'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthButtons } from '@/components/AuthButtons'
import { useEffect, useState } from 'react'

export default function LayoutShell({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [pendingInvites, setPendingInvites] = useState(0)

    useEffect(() => {
        async function fetchInvites() {
            try {
                const res = await fetch('/api/invites/pending')
                const data = await res.json()
                setPendingInvites(data.count || 0)
            } catch (err) {
                console.error('Failed to fetch invites', err)
            }
        }

        fetchInvites()
    }, [])

    const navLinks = [
        { href: '/wishlists', label: 'Wishlists' },
        { href: '/giftexchanges', label: 'Gift Exchanges' },
        { href: '/profile', label: 'Profile'}
    ]

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold">
                        Wishlist
                    </Link>

                    <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`hover:underline ${pathname === href ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                        {pendingInvites > 0 && (
                            <Link
                                href="/invites"
                                title="You have pending invitations"
                                className="relative ml-2 text-yellow-500"
                            >
                                🔔
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {pendingInvites}
                                </span>
                            </Link>
                        )}
                    </nav>
                </div>

                <AuthButtons />
            </header>

            <main className="px-6 py-4">{children}</main>
        </>
    )
}
