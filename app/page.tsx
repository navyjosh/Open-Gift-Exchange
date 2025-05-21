// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center text-center mt-20 space-y-6">
            <h1 className="text-4xl font-bold">🎁 Welcome to Wishlist</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                Create wishlists, share gift ideas, and organize gift exchanges with friends, family, or coworkers.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/wishlists"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    View My Wishlists
                </Link>
                <Link
                    href="/auth/signup"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    Sign up
                </Link>
            </div>
        </div>
    )
}
