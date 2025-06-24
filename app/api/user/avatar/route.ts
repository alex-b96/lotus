import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { put, del } from "@vercel/blob"

export async function POST(req: NextRequest) {
  // 1. Authenticate the user
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Parse the multipart form data
  const formData = await req.formData()
  const file = formData.get("avatar") as File | null
  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
  }

  try {
    // 3. Delete the old avatar if it exists
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (user?.avatarUrl) {
      try {
        // Extract the blob key from the URL (after the last slash)
        const url = new URL(user.avatarUrl)
        // The key is everything after the first "/" (removes leading slash)
        const key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname
        await del(key)
      } catch (err) {
        // Log and continue if deletion fails (e.g., file already deleted)
        console.warn("Failed to delete old avatar:", err)
      }
    }

    // 4. Upload the new file to Vercel Blob
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `avatars/${session.user.id}_${Date.now()}.${ext}`
    const blob = await put(filename, file, { access: "public" })

    // 5. Update the user's avatarUrl in the database
    await db.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: blob.url },
    })

    // 6. Return the new avatar URL
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ error: "Failed to upload avatar." }, { status: 500 })
  }
}