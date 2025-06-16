// app/auth/verify/page.tsx
import { Suspense } from 'react'
import AcceptInvitePage from './AcceptInvitePage'

export default function Page() {
    return (
        <Suspense>
            <AcceptInvitePage />
        </Suspense>
    )
}
