import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black px-4 py-20 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Simplify Gifting. <br className="sm:hidden" /> Share What Matters.
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
                Create and share wishlists, organize gift exchanges, and make giving effortless — whether with friends, family, or coworkers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/wishlists"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    View My Wishlists
                </Link>
                <Link
                    href="/exchanges"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                    Browse Gift Exchanges
                </Link>
                <Link
                    href="/auth/signup"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-base font-medium mt-2 sm:mt-0"
                >
                    Sign up →
                </Link>
            </div>
        </div>
    )
}
