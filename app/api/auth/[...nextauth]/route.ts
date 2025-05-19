import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
