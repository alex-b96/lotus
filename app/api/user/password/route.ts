import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { passwordChangeRateLimiter, getClientIP } from "@/lib/rate-limiter"
import { validatePasswordStrength } from "@/lib/password-validator"

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Parola actuală este obligatorie"),
  newPassword: z.string().min(8, "Parola nouă trebuie să aibă cel puțin 8 caractere").max(128, "Parola nu poate avea mai mult de 128 de caractere"),
})

/**
 * POST /api/user/password - Change user password
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitKey = `password-change:${clientIP}`
    
    if (passwordChangeRateLimiter.isRateLimited(rateLimitKey)) {
      const remainingTime = passwordChangeRateLimiter.getRemainingTime(rateLimitKey)
      return NextResponse.json(
        { 
          error: `Prea multe încercări. Încearcă din nou în ${Math.ceil(remainingTime / 60000)} minute.`,
          retryAfter: remainingTime 
        },
        { status: 429 }
      )
    }

    // Check authentication
    const user = await requireAuth(request)

    // Parse and validate request body
    const body = await request.json()
    const { currentPassword, newPassword } = passwordChangeSchema.parse(body)
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Parola nu respectă cerințele de securitate", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Get the user's current password hash from database
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { password: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilizatorul nu a fost găsit" },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isCurrentPasswordValid) {
      // Ensure consistent response time to prevent timing attacks
      const elapsed = Date.now() - startTime
      const minTime = 200 // Minimum 200ms response time
      if (elapsed < minTime) {
        await new Promise(resolve => setTimeout(resolve, minTime - elapsed))
      }
      
      return NextResponse.json(
        { error: "Parola actuală este incorectă" },
        { status: 400 }
      )
    }
    
    // Check if new password is the same as current password
    const isSamePassword = await bcrypt.compare(newPassword, dbUser.password)
    if (isSamePassword) {
      return NextResponse.json(
        { error: "Parola nouă trebuie să fie diferită de parola actuală" },
        { status: 400 }
      )
    }

    // Hash the new password with higher salt rounds for better security
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update the password in database
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    // Ensure consistent response time
    const elapsed = Date.now() - startTime
    const minTime = 200 // Minimum 200ms response time
    if (elapsed < minTime) {
      await new Promise(resolve => setTimeout(resolve, minTime - elapsed))
    }
    
    return NextResponse.json({
      message: "Parola a fost actualizată cu succes"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Date de intrare invalide", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Autentificare necesară" },
        { status: 401 }
      )
    }

    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    )
  }
}