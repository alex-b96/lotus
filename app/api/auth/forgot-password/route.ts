import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import crypto from "crypto"
import { sendEmail } from "@/lib/email-service"

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

    // Send password reset email
    const emailSubject = "Resetare parolă LOTUS"
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ec4899; margin-bottom: 10px;">LOTUS</h1>
          <h2 style="color: #ffffff; font-weight: 300;">Resetare parolă</h2>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <p style="margin-bottom: 20px; line-height: 1.6;">Salut ${user.name},</p>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            Ai solicitat resetarea parolei pentru contul tău LOTUS. Dacă nu ai făcut această solicitare, poți ignora acest email.
          </p>
          
          <p style="margin-bottom: 30px; line-height: 1.6;">
            Pentru a-ți reseta parola, dă click pe butonul de mai jos:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #ec4899; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500;">
              Resetează parola
            </a>
          </div>
          
          <p style="margin-bottom: 20px; line-height: 1.6; font-size: 14px; color: #cccccc;">
            Dacă butonul nu funcționează, poți copia și lipi următorul link în browser:
          </p>
          
          <p style="margin-bottom: 20px; background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 6px; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </p>
          
          <p style="margin-bottom: 0; line-height: 1.6; font-size: 14px; color: #999999;">
            Acest link va expira în <strong>1 oră</strong>.
          </p>
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #666666;">
          <p>© 2024 LOTUS. Toate drepturile rezervate.</p>
        </div>
      </div>
    `

    await sendEmail(user.email, emailSubject, emailContent)

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