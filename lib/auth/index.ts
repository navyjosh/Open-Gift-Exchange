import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const { email, password } = credentials as {email: string; password: string}
                const user = await prisma.user.findUnique({ where: {email} })

                if (!user || !user.hashedPassword) return null

                const isValid = await bcrypt.compare(password, user.hashedPassword)
                if (!isValid) return null

                return {id: user.id, email: user.email, name: user.name}
            }
        })
    ],
    session: {
        strategy: 'database',
    },
    callbacks: {
        async session({ session, user }) {
            return {
                ...session,
                user: { ...session.user, id: user.id },
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
