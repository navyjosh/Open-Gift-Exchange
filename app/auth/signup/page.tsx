'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { register } from '@/lib/auth/client'

export default function SignUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            await register({ email, password, name })

            // ✅ Automatically sign the user in after successful registration
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })

            if (res?.error) {
                setError(res.error)
            } else {
                router.push('/') // or your desired post-login landing page
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
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
    )
}
