import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      where: {
        publishedAt: {
          lte: new Date() // Only published announcements
        }
      },
      orderBy: [
        { priority: 'desc' }, // Higher priority first
        { publishedAt: 'desc' } // Then by most recent
      ]
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}