import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"

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
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, add custom properties to the token
      if (user) {
        token.sub = user.id // Ensure sub is set from user.id on sign-in
        token.role = user.role
        token.avatarUrl = user.avatarUrl
      }

      // On session update (e.g., after profile update), update the token
      // with the data passed from the client.
      if (trigger === "update" && session) {
        token.name = session.name
        token.email = session.email
        token.avatarUrl = session.avatarUrl
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
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
}