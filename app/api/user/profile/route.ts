import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import * as z from "zod"

// Define a schema for input validation, making fields optional
const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  bio: z.string().max(500, { message: "Bio must be at most 500 characters." }).optional(),
})

export async function PUT(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Ensure there's something to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 })
    }

    // 2. Validate the input
    const validated = profileUpdateSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.flatten().fieldErrors }, { status: 400 })
    }

    const { name, email, bio } = validated.data

    // 3. Build update data object with only explicitly allowed fields
    const updateData: Partial<{ name: string; email: string; bio: string | null }> = {}
    
    if (name) updateData.name = name
    if (email) updateData.email = email  
    if (bio !== undefined) updateData.bio = bio

    // 4. Update the user in the database with only the allowed fields
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    // 5. Return the updated user (excluding password)
    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)

  } catch (error) {
    // Handle potential errors, e.g., if the email is already taken
    if (error instanceof Error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: "This email is already in use by another account." }, { status: 409 })
    }

    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}