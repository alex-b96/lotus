import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * GET /api/authors/[id] - Get a single author by ID with their published poems
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: authorId } = await params

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      )
    }

    // Get author with their published poems
    const author = await db.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        website: true,
        createdAt: true,
        poems: {
          where: {
            status: "PUBLISHED"
          },
          select: {
            id: true,
            title: true,
            content: true,
            category: true,
            readingTime: true,
            publishedAt: true,
            createdAt: true,
            _count: {
              select: {
                likes: true,
                comments: true,
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
          },
          orderBy: {
            publishedAt: "desc"
          }
        },
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
        { error: "Author not found" },
        { status: 404 }
      )
    }

    // Allow author profiles to be shown even if they have zero poems

    // Transform poems data
    const transformedPoems = author.poems.map(poem => ({
      id: poem.id,
      title: poem.title,
      content: poem.content,
      category: poem.category,
      tags: poem.tags.map(poemTag => poemTag.tag.name),
      readingTime: poem.readingTime,
      publishedAt: poem.publishedAt,
      createdAt: poem.createdAt,
      likes: poem._count.likes,
      comments: poem._count.comments,
    }))

    const response = {
      id: author.id,
      name: author.name,
      bio: author.bio,
      avatarUrl: author.avatarUrl,
      website: author.website,
      createdAt: author.createdAt,
      totalPoems: author._count.poems,
      poems: transformedPoems
    }

    return NextResponse.json({ author: response })

  } catch (error) {
    console.error("Error fetching author:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}