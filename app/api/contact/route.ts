import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email-service'

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, subject, message } = data || {}

    // Basic validation
    if (!name || typeof name !== 'string' || name.length < 2) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }
    if (!subject || typeof subject !== 'string' || subject.length < 2) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || message.length < 5) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    // Send the email using the email service
    const result = await sendContactEmail(name, email, subject, message)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send message.' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    // Handle unexpected errors
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 })
  }
}

// Only allow POST
export const dynamic = 'force-dynamic'