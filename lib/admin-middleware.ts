import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Middleware to check if the current user has admin privileges
 * Returns the user data if admin, throws error if not
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error('Authentication required')
  }

  // Get user with role from database
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, role: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.role !== 'ADMIN') {
    throw new Error('Admin privileges required')
  }

  return user
}

/**
 * API middleware function for admin routes
 * Returns 403 Forbidden for non-admin users
 */
export async function withAdminAuth(
  handler: (req: NextRequest, adminUser: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const adminUser = await requireAdmin()
      return handler(req, adminUser)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Access denied'

      return NextResponse.json(
        { error: message },
        { status: message === 'Authentication required' ? 401 : 403 }
      )
    }
  }
}

/**
 * Helper to check if current user is admin (for client-side)
 * Returns boolean, doesn't throw errors
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    await requireAdmin()
    return true
  } catch {
    return false
  }
}