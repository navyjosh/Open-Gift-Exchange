// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            emailVerified?: Date | null
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        id: string
        hashedPassword?: string | null
        emailVerified?: Date | null
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string
        email?: string | null
        name?: string | null
        emailVerified?: Date | null
    }
}
