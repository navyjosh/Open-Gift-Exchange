import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireSession() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {        
        redirect('/auth/signin')
    }

    return session
}
