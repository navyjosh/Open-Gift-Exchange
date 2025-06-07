
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { token } = await req.json()
    const cookieStore = await cookies()

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }
    
    cookieStore.set('inviteToken', token, {
        path: '/',
        httpOnly: false,
    })

    return NextResponse.json({ success: true })
}
