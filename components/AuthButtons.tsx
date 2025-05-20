'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export function AuthButtons() {
    const { data: session } = useSession()

    if (session?.user) {
        return (
            <form action="/api/auth/signout" method="POST">
                <input type="hidden" name="callbackUrl" value="/" />
                <button type="submit" className="text-sm text-red-600 hover:underline ml-auto">
                    Log out
                </button>
            </form>
        )
    }

    return (
        <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline ml-auto">
            Sign in
        </Link>
    )
}
