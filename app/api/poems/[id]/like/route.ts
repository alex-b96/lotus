import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Helper to get user from session (no req param in app directory)
async function getUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return session.user
}

// POST /api/poems/[id]/like - Like a poem
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: poemId } = await context.params
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  try {
    // Create like if not exists
    await db.like.upsert({
      where: { userId_poemId: { userId: user.id, poemId } },
      update: {},
      create: { userId: user.id, poemId },
    })
    // Get new like count
    const count = await db.like.count({ where: { poemId } })
    return NextResponse.json({ liked: true, count })
  } catch (err) {
    return NextResponse.json({ error: "Failed to like poem" }, { status: 500 })
  }
}

// DELETE /api/poems/[id]/like - Unlike a poem
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: poemId } = await context.params
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  try {
    await db.like.delete({
      where: { userId_poemId: { userId: user.id, poemId } },
    })
    const count = await db.like.count({ where: { poemId } })
    return NextResponse.json({ liked: false, count })
  } catch (err) {
    // If like doesn't exist, ignore
    const count = await db.like.count({ where: { poemId } })
    return NextResponse.json({ liked: false, count })
  }
}

// GET /api/poems/[id]/like - Check if current user liked the poem
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: poemId } = await context.params
  const user = await getUser()
  if (!user) {
    // Not logged in: just return count
    const count = await db.like.count({ where: { poemId } })
    return NextResponse.json({ liked: false, count })
  }
  const like = await db.like.findUnique({
    where: { userId_poemId: { userId: user.id, poemId } },
  })
  const count = await db.like.count({ where: { poemId } })
  return NextResponse.json({ liked: !!like, count })
}