import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-middleware'
import { sendRejectionEmail } from '@/lib/email-service'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: poemId } = params

    // Check admin auth directly
    const adminUser = await requireAdmin()

    if (!poemId) {
      return NextResponse.json(
        { error: 'Poem ID is required' },
        { status: 400 }
      )
    }

    // Parse request body for rejection reason
    let rejectionReason = ''
    try {
      const body = await req.json()
      rejectionReason = body.reason || ''
    } catch {
      // Body is optional, continue without rejection reason
    }


    // Check if poem exists and is in submitted status
    const poem = await db.poem.findUnique({
      where: { id: poemId },
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    })

    if (!poem) {
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      )
    }

    if (poem.status !== 'SUBMITTED') {
      return NextResponse.json(
        { error: 'Poem is not in submitted status' },
        { status: 400 }
      )
    }


    // Update poem to rejected status
    const updatedPoem = await db.poem.update({
      where: { id: poemId },
      data: {
        status: 'REJECTED',
        publishedAt: null // Ensure it's not published
      },
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


    // Send rejection email to author
    try {
      const emailResult = await sendRejectionEmail(
        updatedPoem.author.email,
        updatedPoem.author.name || 'Author',
        updatedPoem.title,
        rejectionReason
      )

      if (!emailResult.success) {
        console.warn('Failed to send rejection email:', emailResult.error)
        // Don't fail the entire request if email fails
      } else {
      }
    } catch (emailError) {
      console.warn('Email service error:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      message: 'Poem rejected successfully',
      poem: updatedPoem,
      rejectionReason
    })

  } catch (error) {
    console.error('Error rejecting poem:', error)
    const message = error instanceof Error ? error.message : 'Failed to reject poem'

    return NextResponse.json(
      { error: message },
      { status: message === 'Authentication required' ? 401 : 500 }
    )
  }
}