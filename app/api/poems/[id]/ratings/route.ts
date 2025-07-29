import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const ratingSchema = z.object({
  rating: z.number().min(1).max(10).int()
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Debug: Check if user exists in database
    const userExists = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true }
    })

    if (!userExists) {
      console.error(`User not found in database: ${session.user.id} (${session.user.email})`)
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    console.log(`Rating for user: ${userExists.name} (${userExists.email})`)

    const body = await request.json()
    const validatedData = ratingSchema.parse(body)

    // Check if poem exists
    const poem = await db.poem.findFirst({
      where: {
        id: poemId,
        status: "PUBLISHED"
      }
    })

    if (!poem) {
      return NextResponse.json({ error: "Poem not found" }, { status: 404 })
    }

    // Upsert the rating (create or update)
    const rating = await db.starRating.upsert({
      where: {
        userId_poemId: {
          userId: session.user.id,
          poemId: poemId
        }
      },
      update: {
        rating: validatedData.rating
      },
      create: {
        userId: session.user.id,
        poemId: poemId,
        rating: validatedData.rating
      }
    })

    // Get updated average rating and count
    const stats = await db.starRating.aggregate({
      where: { poemId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    const averageRating = stats._avg.rating || 0
    const ratingCount = stats._count.rating || 0

    // Update the poem's computed fields
    await db.poem.update({
      where: { id: poemId },
      data: {
        averageRating,
        ratingCount
      }
    })

    return NextResponse.json({
      success: true,
      userRating: rating.rating,
      averageRating,
      totalRatings: ratingCount
    })

  } catch (error) {
    console.error("Error handling rating:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid rating data" }, { status: 400 })
    }

    // Handle Prisma foreign key constraint errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2003') {
        return NextResponse.json({
          error: "User not found in database. Please log out and log back in.",
          code: "USER_NOT_FOUND"
        }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params
    const session = await getServerSession(authOptions)

    // Check if poem exists
    const poem = await db.poem.findFirst({
      where: {
        id: poemId,
        status: "PUBLISHED"
      }
    })

    if (!poem) {
      return NextResponse.json({ error: "Poem not found" }, { status: 404 })
    }

    // Get rating statistics
    const stats = await db.starRating.aggregate({
      where: { poemId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    let userRating = null
    if (session?.user?.id) {
      // Debug: Check if user exists in database
      const userExists = await db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true }
      })

      if (!userExists) {
        console.error(`User not found in database (GET): ${session.user.id} (${session.user.email})`)
        // Don't return error here, just skip user rating
      } else {
        const userRatingRecord = await db.starRating.findUnique({
          where: {
            userId_poemId: {
              userId: session.user.id,
              poemId: poemId
            }
          }
        })
        userRating = userRatingRecord?.rating || null
      }
    }

    return NextResponse.json({
      averageRating: stats._avg.rating || 0,
      totalRatings: stats._count.rating || 0,
      userRating
    })

  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poemId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Debug: Check if user exists in database
    const userExists = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true }
    })

    if (!userExists) {
      console.error(`User not found in database (DELETE): ${session.user.id} (${session.user.email})`)
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    // Delete the user's rating
    await db.starRating.delete({
      where: {
        userId_poemId: {
          userId: session.user.id,
          poemId: poemId
        }
      }
    })

    // Get updated average rating and count
    const stats = await db.starRating.aggregate({
      where: { poemId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    const averageRating = stats._avg.rating || 0
    const ratingCount = stats._count.rating || 0

    // Update the poem's computed fields
    await db.poem.update({
      where: { id: poemId },
      data: {
        averageRating,
        ratingCount
      }
    })

    return NextResponse.json({
      success: true,
      averageRating,
      totalRatings: ratingCount
    })

  } catch (error) {
    console.error("Error deleting rating:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}