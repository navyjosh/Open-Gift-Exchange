'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const isLandingPage = pathname === '/'

    return (
        <>
            {!isLandingPage && (
                <header className="flex items-center justify-between px-6 py-4 border-b">
                    <h1 className="text-xl font-bold">
                        <Link href="/">Wishlist</Link>
                    </h1>
                    <AuthButtons />
                </header>
            )}
            <main className="px-6 py-4">{children}</main>
        </>
    )
}
