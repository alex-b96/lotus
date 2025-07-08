import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-middleware'
import { sendApprovalEmail } from '@/lib/email-service'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: poemId } = params

    console.log('Approve API: Starting request for poem:', poemId)

    // Check admin auth directly
    const adminUser = await requireAdmin()
    console.log('Approve API: Admin user verified')

    if (!poemId) {
      return NextResponse.json(
        { error: 'Poem ID is required' },
        { status: 400 }
      )
    }

    console.log('Approve API: Finding poem:', poemId)

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
      console.log('Approve API: Poem not found')
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      )
    }

    if (poem.status !== 'SUBMITTED') {
      console.log('Approve API: Poem not in submitted status:', poem.status)
      return NextResponse.json(
        { error: 'Poem is not in submitted status' },
        { status: 400 }
      )
    }

    console.log('Approve API: Updating poem to published')

    // Update poem to published status
    const updatedPoem = await db.poem.update({
      where: { id: poemId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
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

    console.log('Approve API: Poem approved successfully')

    // Send approval email to author
    try {
      const emailResult = await sendApprovalEmail(
        updatedPoem.author.email,
        updatedPoem.author.name || 'Author',
        updatedPoem.title
      )

      if (!emailResult.success) {
        console.warn('Failed to send approval email:', emailResult.error)
        // Don't fail the entire request if email fails
      } else {
        console.log('Approval email sent successfully to author')
      }
    } catch (emailError) {
      console.warn('Email service error:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      message: 'Poem approved successfully',
      poem: updatedPoem
    })

  } catch (error) {
    console.error('Error approving poem:', error)
    const message = error instanceof Error ? error.message : 'Failed to approve poem'

    return NextResponse.json(
      { error: message },
      { status: message === 'Authentication required' ? 401 : 500 }
    )
  }
}