import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authorListQuerySchema } from "@/lib/validations/authors"
import { z } from "zod"

/**
 * GET /api/authors - List authors with pagination and filtering
 * Authors are users who have at least one published poem
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = authorListQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      order: searchParams.get("order"),
    })

    const skip = (query.page - 1) * query.limit

    // Build where clause - only users with published poems are considered authors
    const where: any = {
      poems: {
        some: {
          status: "PUBLISHED"
        }
      }
    }

    // Add search filter if provided
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { bio: { contains: query.search, mode: "insensitive" } },
      ]
    }

    // Build orderBy clause
    let orderBy: any = {}
    if (query.sortBy === "poems") {
      orderBy = { poems: { _count: query.order } }
    } else if (query.sortBy === "name") {
      orderBy = { name: query.order }
    } else {
      orderBy = { createdAt: query.order }
    }

    // Get authors with their poem counts
    const [authors, totalCount] = await Promise.all([
      db.user.findMany({
        where,
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
        orderBy,
        skip,
        take: query.limit,
      }),
      db.user.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / query.limit)

    return NextResponse.json({
      authors,
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

    console.error("Error fetching authors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}