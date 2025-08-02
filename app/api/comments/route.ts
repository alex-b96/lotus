import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, getAuthenticatedUser } from "@/lib/auth-middleware"
import { z } from "zod"

// Validation schemas
const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(1000, "Comment too long"),
  poemId: z.string().min(1, "Poem ID is required"),
})

const commentListQuerySchema = z.object({
  poemId: z.string().min(1, "Poem ID is required"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * GET /api/comments?poemId=... - Get comments for a specific poem
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = commentListQuerySchema.parse({
      poemId: searchParams.get("poemId"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    })

    const skip = (query.page - 1) * query.limit

    // Verify the poem exists
    const poem = await db.poem.findUnique({
      where: { id: query.poemId },
      select: { id: true }
    })

    if (!poem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    // Get comments with author information
    const [comments, totalCount] = await Promise.all([
      db.comment.findMany({
        where: {
          poemId: query.poemId
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc" // Most recent comments first
        },
        skip,
        take: query.limit,
      }),
      db.comment.count({
        where: {
          poemId: query.poemId
        }
      })
    ])

    const totalPages = Math.ceil(totalCount / query.limit)

    return NextResponse.json({
      comments,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/comments - Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request)

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createCommentSchema.parse(body)

    // Verify the poem exists
    const poem = await db.poem.findUnique({
      where: { id: validatedData.poemId },
      select: { id: true }
    })

    if (!poem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    // Create the comment
    const comment = await db.comment.create({
      data: {
        content: validatedData.content,
        author: {
          connect: {
            id: user.id
          }
        },
        poem: {
          connect: {
            id: validatedData.poemId
          }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}