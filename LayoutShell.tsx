'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthButtons } from '@/components/AuthButtons'

export default function LayoutShell({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navLinks = [
        { href: '/wishlists', label: 'Wishlists' },
        { href: '/giftexchanges', label: 'Gift Exchanges' },
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
                    </nav>
                </div>

                <AuthButtons />
            </header>

            <main className="px-6 py-4">{children}</main>
        </>
    )
}
