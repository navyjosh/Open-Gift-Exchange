import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    
    if (!session) {
        redirect('/auth/signin')
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    

    return <ProfileClient user={user} />
}
