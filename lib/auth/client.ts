export async function register({
    email,
    password,
    name,
}: {
    email: string
    password: string
    name: string
}) {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to register.')
    }

    return res.json()
}
