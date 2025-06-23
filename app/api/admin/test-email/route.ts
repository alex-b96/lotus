import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { testEmailConfiguration, sendApprovalEmail } from '@/lib/email-service'

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const adminUser = await requireAdmin()
    console.log('Test Email API: Admin user verified:', adminUser.email)

    // Parse request body
    const body = await req.json()
    const { testEmail, emailType = 'approval' } = body

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      )
    }

    console.log('Test Email API: Testing email configuration...')

    // Step 1: Test SMTP configuration
    const configTest = await testEmailConfiguration()
    if (!configTest.success) {
      console.error('Test Email API: SMTP configuration failed:', configTest.error)
      return NextResponse.json(
        {
          error: 'SMTP configuration failed',
          details: configTest.error,
          suggestions: [
            'Check your SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)',
            'Verify your email provider credentials',
            'Ensure 2-factor authentication is enabled for Gmail',
            'Use an app-specific password for Gmail'
          ]
        },
        { status: 500 }
      )
    }

    console.log('Test Email API: SMTP configuration valid, sending test email...')

    // Step 2: Send test email based on type
    let emailResult
    if (emailType === 'approval') {
      emailResult = await sendApprovalEmail(
        testEmail,
        'Test Admin User',
        'Sample Test Poem for Email Verification'
      )
    } else {
      // For future rejection email testing
      return NextResponse.json(
        { error: 'Email type not supported yet' },
        { status: 400 }
      )
    }

    if (!emailResult.success) {
      console.error('Test Email API: Failed to send test email:', emailResult.error)
      return NextResponse.json(
        {
          error: 'Failed to send test email',
          details: emailResult.error,
          configValid: true // SMTP config was valid, but sending failed
        },
        { status: 500 }
      )
    }

    console.log('Test Email API: Test email sent successfully')

    return NextResponse.json({
      message: 'Test email sent successfully',
      testEmail,
      emailType,
      configValid: true,
      emailSent: true
    })

  } catch (error) {
    console.error('Test Email API error:', error)
    const message = error instanceof Error ? error.message : 'Failed to test email configuration'

    return NextResponse.json(
      { error: message },
      { status: message === 'Authentication required' ? 401 : 500 }
    )
  }
}