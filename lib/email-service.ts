import * as nodemailer from 'nodemailer'
import { env } from './env'

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
  // Check if email is configured
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error('Email service not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.')
  }

  const config: EmailConfig = {
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587'),
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  }

  return nodemailer.createTransport(config)
}

// Email template for poem approval
function createApprovalEmailTemplate(authorName: string, poemTitle: string) {
  const subject = `🎉 Poezia ta "${poemTitle}" a fost aprobată!`

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
            <p>Felicitări! Poezia ta a fost aprobată</p>
          </div>
          <div class="content">
            <h2>Salut ${authorName},</h2>
            <p>Suntem bucuroși să te informăm că poezia ta a fost aprobată și este acum publicată pe LOTUS Poetry!</p>

            <div class="poem-title">
              <h3>"${poemTitle}"</h3>
              <p><em>Status: Publicată ✅</em></p>
            </div>

            <p>Cuvintele tale frumoase sunt acum live și pot fi descoperite de iubitorii de poezie din comunitatea noastră. Îți mulțumim că ne-ai împărtășit creativitatea!</p>

            <a href="${env.NEXTAUTH_URL}/poems" class="cta-button">Vezi poezia ta publicată</a>

            <p>Continuă să scrii și să ne împărtășești munca ta uimitoare!</p>

            <p>Cu stimă,<br>Echipa LOTUS Poetry</p>
          </div>
          <div class="footer">
            <p>LOTUS Poetry</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    Salut ${authorName},

    Felicitări! Poezia ta "${poemTitle}" a fost aprobată și este acum publicată pe LOTUS Poetry.

    Poezia ta este acum live și poate fi descoperită de iubitorii de poezie din comunitatea noastră. Îți mulțumim că ne-ai împărtășit creativitatea!

    Vizitează ${env.NEXTAUTH_URL}/poems pentru a-ți vedea poezia publicată.

    Continuă să scrii și să ne împărtășești munca ta uimitoare!

    Cu stimă,
    Echipa LOTUS Poetry
  `

  return { subject, html, text }
}

// Email template for poem rejection
function createRejectionEmailTemplate(authorName: string, poemTitle: string, rejectionReason?: string) {
  const subject = `Actualizare privind submisia poeziei: "${poemTitle}"`

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
            <p>Actualizare privind submisia poeziei</p>
          </div>
          <div class="content">
            <h2>Salut ${authorName},</h2>
            <p>Îți mulțumim că ai trimis poezia ta la LOTUS Poetry. După o analiză atentă, am decis să nu publicăm această submisie în acest moment.</p>

            <div class="poem-title">
              <h3>"${poemTitle}"</h3>
              <p><em>Status: Nu a fost aprobată pentru publicare</em></p>
            </div>

            ${rejectionReason ? `
              <div class="feedback-box">
                <h4>📝 Feedback de la recenzor:</h4>
                <p>${rejectionReason}</p>
              </div>
            ` : ''}

            <p>Te rog să nu te descurajezi! Poezia este subiectivă și te încurajăm să:</p>
            <ul>
              <li>Continui să scrii și să-ți explorezi vocea unică</li>
              <li>Să consideri revizuirea acestei poezii pe baza feedback-ului primit</li>
              <li>Să trimiți poezii noi care să-ți demonstreze creativitatea</li>
            </ul>

            <a href="${env.NEXTAUTH_URL}/submit" class="cta-button">Trimite altă poezie</a>

            <p>Credem că fiecare poet are ceva valoros de împărtășit și așteptăm cu nerăbdare să vedem mai multe din lucrul tău!</p>

            <p>Continuă să scrii,<br>Echipa LOTUS Poetry</p>
          </div>
          <div class="footer">
            <p>LOTUS Poetry</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    Salut ${authorName},

    Îți mulțumim că ai trimis poezia ta "${poemTitle}" la LOTUS Poetry.

    După o analiză atentă, am decis să nu publicăm această submisie în acest moment.

    ${rejectionReason ? `Feedback de la recenzor: ${rejectionReason}` : ''}

    Te rog să nu te descurajezi! Te încurajăm să:
    - Continui să scrii și să-ți explorezi vocea unică
    - Să consideri revizuirea acestei poezii pe baza feedback-ului primit
    - Să trimiți poezii noi care să-ți demonstreze creativitatea

    Vizitează ${env.NEXTAUTH_URL}/submit pentru a trimite altă poezie.

    Credem că fiecare poet are ceva valoros de împărtășit și așteptăm cu nerăbdare să vedem mai multe din lucrul tău!

    Continuă să scrii,
    Echipa LOTUS Poetry
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
      from: `"LOTUS Poetry" <${env.SMTP_FROM || env.SMTP_USER}>`,
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
      from: `"LOTUS Poetry" <${env.SMTP_FROM || env.SMTP_USER}>`,
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

/**
 * Send a generic contact email (for contact form submissions)
 * @param fromName Name of the sender (user submitting the form)
 * @param fromEmail Email of the sender
 * @param subject Subject of the message
 * @param message Message body (plain text)
 * @returns { success: boolean, error?: string }
 */
export async function sendContactEmail(
  fromName: string,
  fromEmail: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()
    // Compose the email content
    const to = env.SMTP_USER || env.SMTP_FROM || ''
    const mailSubject = `[Formular Contact] ${subject}`
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <h2>Nouă submisie formular de contact</h2>
        <p><strong>Nume:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Subiect:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">${message.replace(/\n/g, '<br/>')}</div>
      </div>
    `
    const text = `Nouă submisie formular de contact\n\nNume: ${fromName}\nEmail: ${fromEmail}\nSubiect: ${subject}\n\nMesaj:\n${message}`
    const mailOptions = {
      from: `Formular Contact LOTUS <${env.SMTP_FROM || env.SMTP_USER}>`,
      to,
      subject: mailSubject,
      html,
      text,
      replyTo: fromEmail,
    }
    await transporter.sendMail(mailOptions)
    console.log(`Contact form email sent from ${fromEmail} (${fromName})`)
    return { success: true }
  } catch (error) {
    console.error('Error sending contact form email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send contact form email',
    }
  }
}

/**
 * Send a generic email
 * @param to Recipient email address
 * @param subject Email subject
 * @param htmlContent HTML content
 * @returns { success: boolean, error?: string }
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"LOTUS Poetry" <${env.SMTP_FROM || env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent successfully to ${to}`)

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}