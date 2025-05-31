import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth-middleware"
import { z } from "zod"

// Validation schema for updating comments
const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(1000, "Comment too long"),
})

/**
 * PUT /api/comments/[id] - Update a comment (only by the author)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await requireAuth(request)
    const { id } = await params

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateCommentSchema.parse(body)

    // Find the comment and verify ownership
    const existingComment = await db.comment.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Check if the user is the author of the comment
    if (existingComment.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      )
    }

    // Update the comment
    const updatedComment = await db.comment.update({
      where: { id },
      data: {
        content: validatedData.content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    })

    return NextResponse.json(updatedComment)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    console.error("Error updating comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/comments/[id] - Delete a comment (only by the author)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await requireAuth(request)
    const { id } = await params

    // Find the comment and verify ownership
    const existingComment = await db.comment.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Check if the user is the author of the comment
    if (existingComment.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      )
    }

    // Delete the comment
    await db.comment.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}