'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })
        console.log(res)
        if (res?.error) {
            setError('Invalid credentials')
        } else {
            router.push('/')
        }        

    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>

            <button
                onClick={() => signIn('google')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
                Sign in with Google
            </button>

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
