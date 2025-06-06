// app/auth/signin/page.tsx
import SignInPage from './page'
import { cookies } from 'next/headers'

export default async function SignInPageWrapper() {
    const cookieStore = await cookies()
    const inviteToken = cookieStore.get('inviteToken')?.value || null

    return <SignInPage inviteToken={inviteToken} />
}
