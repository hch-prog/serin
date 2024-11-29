// lib/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60, // 12 hours
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
            }
            return session
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token
                token.id = user.id
            }
            return token
        },
    },
    events: {
        async signIn({ user }) {
            if (user.id) {
                try {
                    await prisma.userLog.create({
                        data: {
                            userId: user.id,
                            ipAddress: "127.0.0.1",
                            userAgent: "Unknown",
                        },
                    })
                } catch (error) {
                    console.error("Error creating user log:", error)
                }
            }
        },
    },
    debug: process.env.NODE_ENV === 'development',
}