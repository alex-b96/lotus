import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const feedbackQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * GET /api/feedback - Get all comments from all poems with user and poem data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = feedbackQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    })

    const skip = (query.page - 1) * query.limit

    // Get all comments with author and poem information
    const [comments, totalCount] = await Promise.all([
      db.comment.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            }
          },
          poem: {
            select: {
              id: true,
              title: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc" // Most recent comments first
        },
        skip,
        take: query.limit,
      }),
      db.comment.count()
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

    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}