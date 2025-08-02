import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/poems/featured - Get the featured poem set by admin
 */
export async function GET(request: NextRequest) {
  try {

    // First, try to get the featured poem from site settings
    const siteSettings = await db.siteSettings.findFirst({
      include: {
        featuredPoem: {
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
                starRatings: true,
                comments: true,
              }
            }
          }
        }
      }
    })

    const poem = siteSettings?.featuredPoem

    if (!poem) {
      return NextResponse.json({
        poem: null,
        message: "No featured poem is currently set"
      })
    }

    const transformedPoem = {
      id: poem.id,
      title: poem.title,
      content: poem.content,
      author: poem.author,
      tags: poem.tags.map((poemTag: any) => poemTag.tag.name),
      readingTime: poem.readingTime,
      publishedAt: poem.publishedAt,
      createdAt: poem.createdAt,
      updatedAt: poem.updatedAt,
      likes: poem._count.starRatings,
      comments: poem._count.comments,
    }

    return NextResponse.json({ poem: transformedPoem })

  } catch (error: any) {
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