import * as nodemailer from 'nodemailer'

// Email configuration interface
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Create email transporter
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  }

  return nodemailer.createTransport(config)
}

// Email template for poem approval
function createApprovalEmailTemplate(authorName: string, poemTitle: string) {
  const subject = `🎉 Your poem "${poemTitle}" has been approved!`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .poem-title { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0; }
          .cta-button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 LOTUS Poetry</h1>
            <p>Congratulations! Your poem has been approved</p>
          </div>
          <div class="content">
            <h2>Hello ${authorName},</h2>
            <p>We're excited to inform you that your poem has been approved and is now published on LOTUS Poetry!</p>

            <div class="poem-title">
              <h3>"${poemTitle}"</h3>
              <p><em>Status: Published ✅</em></p>
            </div>

            <p>Your beautiful words are now live and can be discovered by poetry lovers in our community. Thank you for sharing your creativity with us!</p>

            <a href="${process.env.NEXTAUTH_URL}/poems" class="cta-button">View Your Published Poem</a>

            <p>Keep writing and sharing your amazing work!</p>

            <p>Best regards,<br>The LOTUS Poetry Team</p>
          </div>
          <div class="footer">
            <p>LOTUS Poetry - Where poetry blooms and creative souls connect</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    Hello ${authorName},

    Congratulations! Your poem "${poemTitle}" has been approved and is now published on LOTUS Poetry.

    Your poem is now live and can be discovered by poetry lovers in our community. Thank you for sharing your creativity with us!

    Visit ${process.env.NEXTAUTH_URL}/poems to see your published poem.

    Keep writing and sharing your amazing work!

    Best regards,
    The LOTUS Poetry Team
  `

  return { subject, html, text }
}

// Email template for poem rejection
function createRejectionEmailTemplate(authorName: string, poemTitle: string, rejectionReason?: string) {
  const subject = `Update on your poem submission: "${poemTitle}"`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .poem-title { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .feedback-box { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 LOTUS Poetry</h1>
            <p>Update on your poem submission</p>
          </div>
          <div class="content">
            <h2>Hello ${authorName},</h2>
            <p>Thank you for submitting your poem to LOTUS Poetry. After careful review, we've decided not to publish this particular submission at this time.</p>

            <div class="poem-title">
              <h3>"${poemTitle}"</h3>
              <p><em>Status: Not approved for publication</em></p>
            </div>

            ${rejectionReason ? `
              <div class="feedback-box">
                <h4>📝 Reviewer Feedback:</h4>
                <p>${rejectionReason}</p>
              </div>
            ` : ''}

            <p>Please don't be discouraged! Poetry is subjective, and we encourage you to:</p>
            <ul>
              <li>Continue writing and exploring your unique voice</li>
              <li>Consider revising this piece based on any feedback provided</li>
              <li>Submit new poems that showcase your creativity</li>
            </ul>

            <a href="${process.env.NEXTAUTH_URL}/submit" class="cta-button">Submit Another Poem</a>

            <p>We believe every poet has something valuable to share, and we look forward to seeing more of your work!</p>

            <p>Keep writing,<br>The LOTUS Poetry Team</p>
          </div>
          <div class="footer">
            <p>LOTUS Poetry - Where poetry blooms and creative souls connect</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    Hello ${authorName},

    Thank you for submitting your poem "${poemTitle}" to LOTUS Poetry.

    After careful review, we've decided not to publish this particular submission at this time.

    ${rejectionReason ? `Reviewer Feedback: ${rejectionReason}` : ''}

    Please don't be discouraged! We encourage you to:
    - Continue writing and exploring your unique voice
    - Consider revising this piece based on any feedback provided
    - Submit new poems that showcase your creativity

    Visit ${process.env.NEXTAUTH_URL}/submit to submit another poem.

    We believe every poet has something valuable to share, and we look forward to seeing more of your work!

    Keep writing,
    The LOTUS Poetry Team
  `

  return { subject, html, text }
}

// Send approval email to author
export async function sendApprovalEmail(
  authorEmail: string,
  authorName: string,
  poemTitle: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()
    const { subject, html, text } = createApprovalEmailTemplate(authorName, poemTitle)

    const mailOptions = {
      from: `"LOTUS Poetry" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: authorEmail,
      subject,
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Approval email sent successfully to ${authorEmail}`)

    return { success: true }
  } catch (error) {
    console.error('Error sending approval email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send approval email'
    }
  }
}

// Send rejection email to author
export async function sendRejectionEmail(
  authorEmail: string,
  authorName: string,
  poemTitle: string,
  rejectionReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()
    const { subject, html, text } = createRejectionEmailTemplate(authorName, poemTitle, rejectionReason)

    const mailOptions = {
      from: `"LOTUS Poetry" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: authorEmail,
      subject,
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Rejection email sent successfully to ${authorEmail}`)

    return { success: true }
  } catch (error) {
    console.error('Error sending rejection email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send rejection email'
    }
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email configuration is valid')
    return { success: true }
  } catch (error) {
    console.error('Email configuration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email configuration is invalid'
    }
  }
}