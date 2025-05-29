import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-middleware'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Reject API: Starting request for poem:', params.id)

    // Check admin auth directly
    const adminUser = await requireAdmin()
    console.log('Reject API: Admin user verified:', adminUser.email)

    const poemId = params.id

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

    console.log('Reject API: Finding poem:', poemId)

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
      console.log('Reject API: Poem not found')
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      )
    }

    if (poem.status !== 'SUBMITTED') {
      console.log('Reject API: Poem not in submitted status:', poem.status)
      return NextResponse.json(
        { error: 'Poem is not in submitted status' },
        { status: 400 }
      )
    }

    console.log('Reject API: Updating poem to rejected')

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

    console.log('Reject API: Poem rejected successfully')

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