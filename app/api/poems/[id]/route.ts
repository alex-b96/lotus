import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth-middleware"
import { updatePoemSchema } from "@/lib/validations/poems"
import { z } from "zod"

/**
 * GET /api/poems/[id] - Get a single poem by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params

    if (!poemId) {
      return NextResponse.json(
        { error: "Poem ID is required" },
        { status: 400 }
      )
    }

    const poem = await db.poem.findUnique({
      where: { id: poemId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
            website: true,
            _count: {
              select: {
                poems: true,
              }
            }
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
    })

    if (!poem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    // Only show published poems unless it's the author viewing their own poem
    if (poem.status !== "PUBLISHED") {
      // Check if the requester is the author
      try {
        const user = await requireAuth(request)
        if (user.id !== poem.authorId) {
          return NextResponse.json(
            { error: "Poem not found" },
            { status: 404 }
          )
        }
      } catch {
        // Not authenticated, can't view unpublished poem
        return NextResponse.json(
          { error: "Poem not found" },
          { status: 404 }
        )
      }
    }

    const transformedPoem = {
      id: poem.id,
      title: poem.title,
      content: poem.content,
      category: poem.category,
      status: poem.status,
      author: poem.author,
      tags: poem.tags.map(poemTag => poemTag.tag.name),
      readingTime: poem.readingTime,
      publishedAt: poem.publishedAt,
      createdAt: poem.createdAt,
      updatedAt: poem.updatedAt,
      likes: poem._count.likes,
      comments: poem._count.comments,
    }

    return NextResponse.json({ poem: transformedPoem })

  } catch (error) {
    console.error("Error fetching poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/poems/[id] - Update a poem by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params

    if (!poemId) {
      return NextResponse.json(
        { error: "Poem ID is required" },
        { status: 400 }
      )
    }

    // Check authentication
    const user = await requireAuth(request)

    // Check if poem exists
    const existingPoem = await db.poem.findUnique({
      where: { id: poemId },
      select: { id: true, authorId: true }
    })

    if (!existingPoem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingPoem.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only update your own poems" },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updatePoemSchema.parse(body)

    // Calculate reading time if content is being updated
    let readingTime: number | undefined
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length
      readingTime = Math.max(1, Math.ceil(wordCount / 200))
    }

    // Update the poem
    const updateData: any = {
      ...validatedData,
      ...(readingTime && { readingTime }),
      updatedAt: new Date(),
    }

    // Set publishedAt if status is being changed to published
    if (validatedData.status === "PUBLISHED") {
      const currentPoem = await db.poem.findUnique({
        where: { id: poemId },
        select: { status: true, publishedAt: true }
      })

      if (currentPoem?.status !== "PUBLISHED" && !currentPoem?.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const updatedPoem = await db.poem.update({
      where: { id: poemId },
      data: updateData,
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

    // Handle tags if provided
    if (validatedData.tags !== undefined) {
      // Remove all existing tags for this poem
      await db.poemTag.deleteMany({
        where: { poemId: poemId }
      })

      // Add new tags if any
      if (validatedData.tags.length > 0) {
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
              poemId: poemId,
              tagId: tag.id
            }
          })
        }
      }
    }

    // Fetch the complete updated poem
    const completePoem = await db.poem.findUnique({
      where: { id: poemId },
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
      message: "Poem updated successfully",
      poem: {
        ...completePoem,
        tags: completePoem?.tags.map(poemTag => poemTag.tag.name) || []
      }
    })

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

    console.error("Error updating poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/poems/[id] - Delete a poem by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params

    if (!poemId) {
      return NextResponse.json(
        { error: "Poem ID is required" },
        { status: 400 }
      )
    }

    // Check authentication
    const user = await requireAuth(request)

    // Check if poem exists and get ownership info
    const existingPoem = await db.poem.findUnique({
      where: { id: poemId },
      select: { id: true, authorId: true, title: true }
    })

    if (!existingPoem) {
      return NextResponse.json(
        { error: "Poem not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingPoem.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own poems" },
        { status: 403 }
      )
    }

    // Delete the poem (this will cascade delete related records like likes, comments, etc.)
    await db.poem.delete({
      where: { id: poemId }
    })

    return NextResponse.json({
      message: "Poem deleted successfully",
      deletedPoem: {
        id: existingPoem.id,
        title: existingPoem.title
      }
    })

  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    console.error("Error deleting poem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}