import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { env } from "./env"

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    bio?: string | null
    avatarUrl?: string | null
    website?: string | null
    role: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      bio?: string | null
      avatarUrl?: string | null
      website?: string | null
      role: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            website: user.website,
            role: user.role,
          }
        } catch (error) {
          console.error('Database error during authentication:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, add custom properties to the token
      if (user) {
        token.sub = user.id // Ensure sub is set from user.id on sign-in
        token.role = user.role
        token.avatarUrl = user.avatarUrl
        token.bio = user.bio
      }

      // Secure session updates: fetch fresh data from database when triggered
      if (trigger === "update") {
        try {
          // Get fresh user data from database (server-side, secure)
          const freshUser = await db.user.findUnique({
            where: { id: token.sub },
            select: { name: true, email: true, bio: true, avatarUrl: true, role: true }
          })
          
          if (freshUser) {
            token.name = freshUser.name     // ✅ From database, not client
            token.email = freshUser.email   // ✅ Secure source
            token.bio = freshUser.bio       // ✅ Verified data
            token.avatarUrl = freshUser.avatarUrl // ✅ Trustworthy
            token.role = freshUser.role     // ✅ Fresh role from database
          }
        } catch (error) {
          console.error("Database error in JWT callback:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      // Pass properties from the token to the client-side session object
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.avatarUrl = token.avatarUrl as string
        session.user.bio = token.bio as string | null
      }
      
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
}