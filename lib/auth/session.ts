'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import {encodeURIComponent}

export async function requireSession() {
            const { resolvedUrl, req } = context;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        const redirectUrl = ${encodeURIComponent(context.asPath)}
        const headersList = headers()
        const referer = headersList.get('referer') || '/'
        const encoded = encodeURIComponent(new URL(referer).pathname)

        redirect(`/auth/signin?callbackUrl=${encoded}`)
    }

    return session
}
