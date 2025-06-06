import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-middleware"
import { z } from "zod"

const toggleFeaturedSchema = z.object({
  featured: z.boolean()
})

/**
 * PUT /api/admin/authors/[id]/featured - Toggle author featured status
 * Only administrators can feature/unfeature authors
 */
async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const { featured } = toggleFeaturedSchema.parse(body)

    // Check if the user exists and is an author (has published poems)
    const author = await db.user.findFirst({
      where: {
        id,
        poems: {
          some: {
            status: "PUBLISHED"
          }
        }
      },
      select: {
        id: true,
        name: true,
        featured: true,
        _count: {
          select: {
            poems: {
              where: {
                status: "PUBLISHED"
              }
            }
          }
        }
      }
    })

    if (!author) {
      return NextResponse.json(
        { error: "Author not found or has no published poems" },
        { status: 404 }
      )
    }

    // Update the featured status
    const updatedAuthor = await db.user.update({
      where: { id },
      data: { featured },
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
      }
    })

    return NextResponse.json({
      author: updatedAuthor,
      message: `${author.name} has been ${featured ? 'featured' : 'unfeatured'} successfully`
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    // Handle admin auth errors
    if (error instanceof Error) {
      const status = error.message === 'Authentication required' ? 401 :
                    error.message === 'Admin privileges required' ? 403 : 500
      return NextResponse.json(
        { error: error.message },
        { status }
      )
    }

    console.error("Error toggling author featured status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export { PUT }