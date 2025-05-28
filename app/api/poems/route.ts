import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, getAuthenticatedUser } from "@/lib/auth-middleware"
import { createPoemSchema, poemListQuerySchema } from "@/lib/validations/poems"
import { z } from "zod"

/**
 * GET /api/poems - List poems with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = poemListQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      category: searchParams.get("category"),
      authorId: searchParams.get("authorId"),
      tag: searchParams.get("tag"),
      sortBy: searchParams.get("sortBy"),
      order: searchParams.get("order"),
    })

    const skip = (query.page - 1) * query.limit

    // Build where clause based on filters
    const where: any = {
      status: "published", // Only show published poems by default
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

    if (query.authorId) {
      where.authorId = query.authorId
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
      orderBy.likes = { _count: query.order }
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
              email: true,
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
              likes: true,
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
      likes: poem._count.likes,
      comments: poem._count.comments,
    }))

    const totalPages = Math.ceil(totalCount / query.limit)

    return NextResponse.json({
      poems: transformedPoems,
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

    console.error("Error fetching poems:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/poems - Create a new poem
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request)

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createPoemSchema.parse(body)

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = validatedData.content.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    // Create the poem
    const poem = await db.poem.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        status: validatedData.status,
        readingTime,
        publishedAt: validatedData.status === "published" ? new Date() : null,
        author: {
          connect: {
            id: user.id
          }
        }
      }
    })

    // Handle tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      // Create or find tags and create PoemTag relationships
      for (const tagName of validatedData.tags) {
        // Create tag if it doesn't exist
        const tag = await db.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })

        // Create PoemTag relationship
        await db.poemTag.create({
          data: {
            poemId: poem.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch the complete poem with tags for response
    const completePoem = await db.poem.findUnique({
      where: { id: poem.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
        }
      }
    })

    return NextResponse.json({
      message: "Poem created successfully",
      poem: {
        ...completePoem,
        tags: completePoem?.tags.map(poemTag => poemTag.tag.name) || []
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    console.error("Error creating poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}