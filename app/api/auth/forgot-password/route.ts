import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email-service"

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalid"),
})

/**
 * POST /api/auth/forgot-password - Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true, email: true, name: true }
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: "If the email exists, a password reset link has been sent." },
        { status: 200 }
      )
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Send password reset email using the email service
    await sendPasswordResetEmail(user.email, user.name, resetUrl)

    return NextResponse.json(
      { message: "If the email exists, a password reset link has been sent." },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email invalid", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "A apărut o eroare. Te rog să încerci din nou." },
      { status: 500 }
    )
  }
}