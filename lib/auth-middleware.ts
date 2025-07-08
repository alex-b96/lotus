import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { env } from "./env"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
  }
}

/**
 * Middleware to check if the user is authenticated
 * Returns the user data if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: env.NEXTAUTH_SECRET
    })

    if (!token || !token.sub) {
      return null
    }

    return {
      id: token.sub,
      email: token.email as string,
      name: token.name as string,
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}

/**
 * Check if user is authenticated and return user data or throw error
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}