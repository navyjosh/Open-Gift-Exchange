// app/invite/[token]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface InvitePageProps {
    params: { token: string }
}

export default async function InvitePage({ params }: InvitePageProps) {
    const invite = await prisma.invite.findUnique({
        where: { token: params.token },
        include: { exchange: true },
    })
    const cookieStore = await cookies()
    cookieStore.set('inviteToken', params.token, {httpOnly: true})

    if (!invite) return notFound()

    const { email, status, exchange } = invite

    return (
        <div className="max-w-lg mx-auto mt-20 space-y-4 text-center">
            <h1 className="text-2xl font-bold">🎁 You&apos;re invited!</h1>
            <p>
                <strong>{email}</strong>, you&apos;ve been invited to join{' '}
                <span className="font-semibold">{exchange.name}</span>.
            </p>

            {status !== 'PENDING' ? (
                <p className="text-sm text-gray-500">This invitation is no longer active.</p>
            ) : (
                <div className="space-y-2">
                    <Link
                        href={`/auth/signup?callbackUrl=/invite/${params.token}`}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Accept & Sign Up
                    </Link>
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href={`/auth/signin?callbackUrl=/invite/${params.token}`} className="text-blue-600 underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}
