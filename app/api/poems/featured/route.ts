import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/poems/featured - Get the featured poem of the week (or fallback to random)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("Starting featured poem fetch...")

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
                likes: true,
                comments: true,
              }
            }
          }
        }
      }
    })

    let poem = siteSettings?.featuredPoem

    // If no featured poem is set, fallback to a random published poem
    if (!poem) {
      console.log("No featured poem set, falling back to random poem...")

      // Get total count of published poems
      const totalCount = await db.poem.count({
        where: { status: "PUBLISHED" }
      })
      console.log("Poem count:", totalCount)

      if (totalCount === 0) {
        return NextResponse.json({
          poem: null,
          message: "No published poems available"
        })
      }

      // Use a consistent "random" offset based on the current week
      // This ensures the same poem shows for the entire week unless admin sets one
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7)
      const consistentOffset = (weekNumber * 7) % totalCount
      console.log("Consistent offset for week", weekNumber, ":", consistentOffset)

      // Fetch the random poem
      console.log("Fetching random poem...")
      poem = await db.poem.findFirst({
        where: { status: "PUBLISHED" },
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
        skip: consistentOffset,
      })
    } else {
      console.log("Found featured poem:", poem.title)
    }

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
      tags: poem.tags.map((poemTag: any) => poemTag.tag.name),
      readingTime: poem.readingTime,
      publishedAt: poem.publishedAt,
      createdAt: poem.createdAt,
      updatedAt: poem.updatedAt,
      likes: poem._count.likes,
      comments: poem._count.comments,
    }

    console.log("Successfully fetched poem:", poem.title)
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