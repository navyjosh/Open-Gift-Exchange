'use client'

import { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [hasGoogleProvider, setHasGoogleProvider] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function loadProviders() {
            const providers = await getProviders()
            if (providers && 'google' in providers) {
                setHasGoogleProvider(true)
            }
        }
        loadProviders()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/wishlists'
        })

        if (res?.error) {
            setError('Invalid credentials')
        } else if (res?.url) {
            router.push(res.url)
        } else {
            router.push('/')
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>

            {hasGoogleProvider && (
                <div className="mb-4">
                    <Image
                        width={150}
                        height={20}
                        src="/images/signin-assets/google-svg/light/web_light_rd_SI.svg"
                        alt="Sign in with Google"
                        className="block dark:hidden max-w-xs mx-auto cursor-pointer"
                        onClick={() => signIn('google', { callbackUrl: '/wishlists' })}
                    />
                    <Image
                        width={200}
                        height={20}
                        src="/images/signin-assets/google-svg/dark/web_dark_rd_SI.svg"
                        alt="Sign in with Google"
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

            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    Sign in
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Don’t have an account?{' '}
                <button
                    onClick={() => router.push('/auth/signup')}
                    className="text-blue-600 underline"
                >
                    Sign up here
                </button>
            </p>
        </div>
    )
}
