import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

/**
 * GET /api/admin/featured-poem - Get current featured poem
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current site settings with featured poem
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
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      featuredPoem: siteSettings?.featuredPoem ? {
        id: siteSettings.featuredPoem.id,
        title: siteSettings.featuredPoem.title,
        author: siteSettings.featuredPoem.author,
        tags: siteSettings.featuredPoem.tags.map(poemTag => poemTag.tag.name),
        publishedAt: siteSettings.featuredPoem.publishedAt,
        featuredAt: siteSettings.featuredAt
      } : null
    })

  } catch (error) {
    console.error("Error fetching featured poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/featured-poem - Set a poem as featured poem of the week
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { poemId } = await request.json()

    if (!poemId) {
      return NextResponse.json(
        { error: "Poem ID is required" },
        { status: 400 }
      )
    }

    // Verify poem exists and is published
    const poem = await db.poem.findFirst({
      where: {
        id: poemId,
        status: "PUBLISHED"
      }
    })

    if (!poem) {
      return NextResponse.json(
        { error: "Poem not found or not published" },
        { status: 404 }
      )
    }

    // Update or create site settings with featured poem
    const siteSettings = await db.siteSettings.upsert({
      where: { id: "main" }, // Use a fixed ID for main site settings
      update: {
        featuredPoemId: poemId,
        featuredAt: new Date()
      },
      create: {
        id: "main",
        featuredPoemId: poemId,
        featuredAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Poem set as featured successfully",
      poemId: poemId,
      featuredAt: siteSettings.featuredAt
    })

  } catch (error) {
    console.error("Error setting featured poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/featured-poem - Remove featured poem
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove featured poem from site settings
    await db.siteSettings.updateMany({
      data: {
        featuredPoemId: null,
        featuredAt: null
      }
    })

    return NextResponse.json({
      success: true,
      message: "Featured poem removed successfully"
    })

  } catch (error) {
    console.error("Error removing featured poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}