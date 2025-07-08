import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-middleware'

export async function GET(req: NextRequest) {
  try {
    console.log('Admin API: Starting request')

    // Check admin auth directly
    const adminUser = await requireAdmin()
    console.log('Admin API: Admin user verified')

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const skip = (page - 1) * limit

    console.log('Admin API: Fetching submitted poems...')

    // Get submitted poems with author information
    const poems = await db.poem.findMany({
      where: {
        status: 'SUBMITTED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Most recent submissions first
      },
      skip,
      take: limit
    })

    console.log('Admin API: Found poems:', poems.length)

    // Get total count for pagination
    const totalCount = await db.poem.count({
      where: { status: 'SUBMITTED' }
    })

    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // Transform data to include flat tags array
    const transformedPoems = poems.map((poem: any) => ({
      ...poem,
      tags: poem.tags.map((pt: any) => pt.tag.name),
      likes: poem._count.likes,
      comments: poem._count.comments
    }))

    console.log('Admin API: Returning response')

    return NextResponse.json({
      poems: transformedPoems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev
      }
    })

  } catch (error) {
    console.error('Admin API Error:', error)
    const message = error instanceof Error ? error.message : 'Access denied'

    return NextResponse.json(
      { error: message },
      { status: message === 'Authentication required' ? 401 : 403 }
    )
  }
}