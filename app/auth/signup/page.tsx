'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { register } from '@/lib/auth/client'
import Image from 'next/image'

export default function SignUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [showGoogle, setShowGoogle] = useState(false)

    useEffect(() => {
        setShowGoogle(process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true')
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            await register({ email, password, name })

            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })

            if (res?.error) {
                setError(res.error)
            } else {
                router.push('/')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Something went wrong.')
            }
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

            {showGoogle && (
                <div className="mb-4">
                    {/* Light mode image */}
                    <Image
                        width={150}
                        height={20}
                        src="/images/signin-assets/google-svg/light/web_light_rd_SI.svg"
                        alt="Sign up with Google"
                        className="block dark:hidden max-w-xs mx-auto cursor-pointer"
                        onClick={() => signIn('google', { callbackUrl: '/wishlists' })}
                    />

                    {/* Dark mode image */}
                    <Image
                        width={200}
                        height={20}
                        src="/images/signin-assets/google-svg/dark/web_dark_rd_SI.svg"
                        alt="Sign up with Google"
                        className="hidden dark:block max-w-xs mx-auto cursor-pointer"
                        onClick={() => signIn('google', { callbackUrl: '/wishlists' })}
                    />
                </div>
            )}

            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                <div className="h-px w-full bg-slate-200"></div>
                OR
                <div className="h-px w-full bg-slate-200"></div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Account
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Already have an account?{' '}
                <button
                    onClick={() => router.push('/auth/signin')}
                    className="text-blue-600 underline"
                >
                    Sign in here
                </button>
            </p>
        </div>
    )
}
