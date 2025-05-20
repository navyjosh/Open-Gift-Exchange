import { PrismaAdapter } from '@auth/prisma-adapter'
import { isGoogleAuthEnabled } from './config'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

// const prisma = new PrismaClient()
const providers = []
if (isGoogleAuthEnabled) {
    providers.push(GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }))
}
providers.push(CredentialsProvider({
    id: "credentials",
    name: "credentials",
    credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {

        const { email, password } = credentials as { email: string; password: string }
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.hashedPassword) {

            return null
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword)
        if (!isValid) {

            return null
        }

        return { id: user.id, email: user.email, name: user.name }
    }
}))

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: providers,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string
            session.user.email = token.email as string
            session.user.name = token.name as string
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
