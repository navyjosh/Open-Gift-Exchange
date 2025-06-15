// app/profile/page.tsx
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin') // Force sign in if not authenticated
    }

    return (
        <div className="max-w-xl mx-auto mt-12 px-4">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <div className="bg-white dark:bg-gray-800 shadow rounded p-6 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{session.user.name || 'No name provided'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{session.user.email}</p>
                </div>
                <div>
                    <p className='text-sm text-gray-500'>Email Verified</p>
                    <p className='font-medium'>{session.user.emailVerified === null ? 'No' : 'Yes'}</p>
                </div>
                {/* Add more profile fields or settings here */}
            </div>
        </div>
    )
}
