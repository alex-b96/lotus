import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { poemListQuerySchema } from "@/lib/validations/poems"
import { z } from "zod"

/**
 * GET /api/authors/[id]/poems - Get all published poems by a specific author
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: authorId } = await params
    const { searchParams } = new URL(request.url)

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      )
    }

    // Parse query parameters (reuse poem query schema but filter by authorId)
    const query = poemListQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      category: searchParams.get("category"),
      tag: searchParams.get("tag"),
      sortBy: searchParams.get("sortBy"),
      order: searchParams.get("order"),
    })

    const skip = (query.page - 1) * query.limit

    // First, verify the author exists and is actually an author
    const authorExists = await db.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
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

    if (!authorExists) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    if (authorExists._count.poems === 0) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {
      authorId,
      status: "PUBLISHED"
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.category) {
      where.category = query.category
    }

    if (query.tag) {
      where.tags = {
        some: {
          tag: {
            name: query.tag
          }
        }
      }
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (query.sortBy === "likes") {
      orderBy.starRatings = { _count: query.order }
    } else {
      orderBy[query.sortBy] = query.order
    }

    // Get poems with author information and tags
    const [poems, totalCount] = await Promise.all([
      db.poem.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true,
                }
              }
            }
          },
          _count: {
            select: {
              starRatings: true,
              comments: true,
            }
          }
        },
        orderBy,
        skip,
        take: query.limit,
      }),
      db.poem.count({ where })
    ])

    // Transform the data for the response
    const transformedPoems = poems.map(poem => ({
      id: poem.id,
      title: poem.title,
      content: poem.content,
      category: poem.category,
      author: poem.author,
      tags: poem.tags.map(poemTag => poemTag.tag.name),
      readingTime: poem.readingTime,
      publishedAt: poem.publishedAt,
      createdAt: poem.createdAt,
      updatedAt: poem.updatedAt,
      likes: poem._count.starRatings,
      comments: poem._count.comments,
    }))

    const totalPages = Math.ceil(totalCount / query.limit)

    return NextResponse.json({
      poems: transformedPoems,
      author: {
        id: authorExists.id,
        name: authorExists.name,
      },
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

    console.error("Error fetching author poems:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}