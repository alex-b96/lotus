import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-middleware'

/**
 * DELETE /api/admin/poems/[id] - Delete a published poem
 * Only administrators can delete poems
 * This will cascade delete all comments, tags, and star ratings for this poem
 * If the poem is currently featured, it will be unfeatured first
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const adminUser = await requireAdmin()

        const { id: poemId } = await params

        if (!poemId) {
            return NextResponse.json(
                { error: 'Poem ID is required' },
                { status: 400 }
            )
        }

        // Check if poem exists and get its status
        const poem = await db.poem.findUnique({
            where: { id: poemId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!poem) {
            return NextResponse.json(
                { error: 'Poem not found' },
                { status: 404 }
            )
        }

        // Only allow deletion of published poems
        if (poem.status !== 'PUBLISHED') {
            return NextResponse.json(
                { error: 'Only published poems can be deleted' },
                { status: 400 }
            )
        }

        // Check if this poem is currently featured
        const siteSettings = await db.siteSettings.findFirst({
            where: {
                featuredPoemId: poemId
            }
        })

        // If poem is featured, unfeature it first
        if (siteSettings) {
            await db.siteSettings.updateMany({
                data: {
                    featuredPoemId: null,
                    featuredAt: null
                }
            })
        }

        // Delete the poem - cascade deletes will automatically handle:
        // - All comments on this poem (onDelete: Cascade)
        // - All PoemTag relationships (onDelete: Cascade)
        // - All StarRating entries (onDelete: Cascade)
        await db.poem.delete({
            where: { id: poemId }
        })

        return NextResponse.json({
            message: `Poem "${poem.title}" has been deleted successfully`,
            deletedPoem: {
                id: poem.id,
                title: poem.title,
                author: poem.author.name
            }
        })

    } catch (error) {
        console.error('Error deleting poem:', error)
        const message = error instanceof Error ? error.message : 'Failed to delete poem'

        return NextResponse.json(
            { error: message },
            { status: message === 'Authentication required' ? 401 : 500 }
        )
    }
}
