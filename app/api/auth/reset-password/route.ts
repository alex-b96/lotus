import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

/**
 * POST /api/auth/reset-password - Reset password with token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)

    // Find user with valid reset token
    const user = await db.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      },
      select: { id: true, email: true, name: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token invalid sau expirat. Te rog să soliciți din nou resetarea parolei." },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Update user with new password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json(
      { message: "Parola a fost resetată cu succes. Te poți conecta cu noua parolă." },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Date invalide", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "A apărut o eroare. Te rog să încerci din nou." },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/reset-password?token=xxx - Validate reset token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    // Check if token exists and is not expired
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      },
      select: { id: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token invalid sau expirat" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { valid: true, email: user.email },
      { status: 200 }
    )

  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      { error: "A apărut o eroare la validarea token-ului" },
      { status: 500 }
    )
  }
}