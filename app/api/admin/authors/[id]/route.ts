import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/admin-middleware"

/**
 * DELETE /api/admin/authors/[id] - Delete an author account
 * Only administrators can delete authors
 * This will cascade delete all poems, comments, and star ratings by this author
 */
async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin auth - this will throw an error if not admin
    const adminUser = await requireAdmin()

    const { id: authorId } = await params

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      )
    }

    // Prevent self-deletion
    if (adminUser.id === authorId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      )
    }

    // Check if the author exists
    const author = await db.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            poems: true,
            comments: true,
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

    // Prevent deleting other admins (optional protection)
    if (author.role === 'ADMIN') {
      return NextResponse.json(
        { error: "Cannot delete admin accounts" },
        { status: 403 }
      )
    }

    // Set reviewedBy to null for any poems reviewed by this user
    // This is necessary because the reviewedBy relation doesn't have cascade delete
    await db.poem.updateMany({
      where: { reviewedBy: authorId },
      data: { reviewedBy: null }
    })

    // Delete the user - this will cascade delete:
    // - All poems authored by this user (onDelete: Cascade)
    // - All comments by this user (onDelete: Cascade)
    // - All star ratings by this user (onDelete: Cascade)
    await db.user.delete({
      where: { id: authorId }
    })

    return NextResponse.json({
      success: true,
      message: `Author "${author.name}" and all associated content have been deleted successfully`,
      deletedAuthor: {
        id: author.id,
        name: author.name,
        email: author.email,
        poemsCount: author._count.poems,
        commentsCount: author._count.comments
      }
    })

  } catch (error) {
    // Handle admin auth errors
    if (error instanceof Error) {
      const status = error.message === 'Authentication required' ? 401 :
                    error.message === 'Admin privileges required' ? 403 : 500
      return NextResponse.json(
        { error: error.message },
        { status }
      )
    }

    console.error("Error deleting author:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export { DELETE }

