import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/poems/featured - Get a featured poem (random published poem)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("Starting featured poem fetch...")

    // Get total count of published poems
    console.log("Attempting to count poems...")
    const totalCount = await db.poem.count({
      where: { status: "published" }
    })
    console.log("Poem count:", totalCount)

    if (totalCount === 0) {
      return NextResponse.json({
        poem: null,
        message: "No published poems available"
      })
    }

    // Get a random offset
    const randomOffset = Math.floor(Math.random() * totalCount)
    console.log("Random offset:", randomOffset)

    // Fetch the random poem
    console.log("Fetching random poem...")
    const poem = await db.poem.findFirst({
      where: { status: "published" },
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
      skip: randomOffset,
    })

    if (!poem) {
      return NextResponse.json({
        poem: null,
        message: "No poem found"
      })
    }

    const transformedPoem = {
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
    }

    console.log("Successfully fetched poem:", poem.title)
    return NextResponse.json({ poem: transformedPoem })

  } catch (error) {
    console.error("Error fetching featured poem:", error)
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}