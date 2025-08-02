import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/authors/featured - Get featured authors
 * Returns authors manually marked as featured by administrators
 */
export async function GET() {
  try {
    // Get authors marked as featured by administrators (exclude admin users)
    const featuredAuthors = await db.user.findMany({
      where: {
        featured: true,
        role: "USER", // Exclude admin users from featured authors
        poems: {
          some: {
            status: "PUBLISHED"
          }
        }
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        website: true,
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
      orderBy: {
        createdAt: "desc"
      },
    })

    return NextResponse.json({
      authors: featuredAuthors
    })

  } catch (error) {
    console.error("Error fetching featured authors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}