import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-middleware"

/**
 * GET /api/admin/authors - List all authors for admin management
 * Returns all users who are authors (have published poems) with their featured status
 */
async function GET(request: NextRequest) {
  try {
    // Check admin auth
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    // Build where clause - only users with published poems are considered authors
    const where: any = {
      poems: {
        some: {
          status: "PUBLISHED"
        }
      }
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get authors with their poem counts and featured status
    const [authors, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatarUrl: true,
          website: true,
          featured: true,
          createdAt: true,
          _count: {
            select: {
              poems: {
                where: {
                  status: "PUBLISHED"
                }
              }
            }
          }
        },
        orderBy: [
          { featured: "desc" }, // Featured authors first
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      }),
      db.user.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      authors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    console.error("Error fetching admin authors:", error)

    // Handle admin auth errors
    if (error instanceof Error) {
      const status = error.message === 'Authentication required' ? 401 :
                    error.message === 'Admin privileges required' ? 403 : 500
      return NextResponse.json(
        { error: error.message },
        { status }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export { GET }