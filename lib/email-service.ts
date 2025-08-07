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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin-bottom: 10px;">🌸 LOTUS</h1>
            <h2 style="color: #ffffff; font-weight: 300; margin-top: 0;">Poezia ta a fost aprobată!</h2>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <p style="margin-bottom: 20px; line-height: 1.6;">Salut ${authorName},</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6;">
              Suntem bucuroși să te informăm că poezia ta a fost aprobată și este acum publicată pe LOTUS Poetry!
            </p>

            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #22c55e; margin-top: 0; margin-bottom: 10px;">"${poemTitle}"</h3>
              <p style="color: #a3e635; margin: 0;"><em>✅ Status: Publicată</em></p>
            </div>

            <p style="margin-bottom: 20px; line-height: 1.6;">
              Cuvintele tale frumoase sunt acum live și pot fi descoperite de iubitorii de poezie din comunitatea noastră. Îți mulțumim că ne-ai împărtășit creativitatea!
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${env.NEXTAUTH_URL}/poems" style="display: inline-block; background-color: #22c55e; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500;">
                Vezi poezia ta publicată
              </a>
            </div>

            <p style="margin-bottom: 20px; line-height: 1.6;">
              Continuă să scrii și să ne împărtășești munca ta uimitoare!
            </p>

            <p style="margin-bottom: 0; line-height: 1.6;">
              Cu stimă,<br>
              <strong style="color: #22c55e;">Echipa LOTUS Poetry</strong>
            </p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666666;">
            <p style="margin: 0;">© 2024 LOTUS. Toate drepturile rezervate.</p>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin-bottom: 10px;">🌸 LOTUS</h1>
            <h2 style="color: #ffffff; font-weight: 300; margin-top: 0;">Actualizare privind submisia poeziei</h2>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <p style="margin-bottom: 20px; line-height: 1.6;">Salut ${authorName},</p>
            
            <p style="margin-bottom: 20px; line-height: 1.6;">
              Îți mulțumim că ai trimis poezia ta la LOTUS Poetry. După o analiză atentă, am decis să nu publicăm această submisie în acest moment.
            </p>

            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f59e0b; margin-top: 0; margin-bottom: 10px;">"${poemTitle}"</h3>
              <p style="color: #fbbf24; margin: 0;"><em>Status: Nu a fost aprobată pentru publicare</em></p>
            </div>

            ${rejectionReason ? `
              <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #f59e0b; margin-top: 0; margin-bottom: 15px;">📝 Feedback de la recenzor:</h4>
                <p style="color: #fbbf24; margin: 0; line-height: 1.6;">${rejectionReason}</p>
              </div>
            ` : ''}

            <p style="margin-bottom: 20px; line-height: 1.6;">
              Te rog să nu te descurajezi! Poezia este subiectivă și te încurajăm să:
            </p>
            
            <ul style="margin-bottom: 20px; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Continui să scrii și să-ți explorezi vocea unică</li>
              <li style="margin-bottom: 8px;">Să consideri revizuirea acestei poezii pe baza feedback-ului primit</li>
              <li style="margin-bottom: 8px;">Să trimiți poezii noi care să-ți demonstreze creativitatea</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${env.NEXTAUTH_URL}/submit" style="display: inline-block; background-color: #f59e0b; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500;">
                Trimite altă poezie
              </a>
            </div>

            <p style="margin-bottom: 20px; line-height: 1.6;">
              Credem că fiecare poet are ceva valoros de împărtășit și așteptăm cu nerăbdare să vedem mai multe din lucrul tău!
            </p>

            <p style="margin-bottom: 0; line-height: 1.6;">
              Continuă să scrii,<br>
              <strong style="color: #f59e0b;">Echipa LOTUS Poetry</strong>
            </p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666666;">
            <p style="margin: 0;">© 2024 LOTUS. Toate drepturile rezervate.</p>
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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark">
          <meta name="supported-color-schemes" content="dark">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ec4899; margin-bottom: 10px;">🌸 LOTUS</h1>
              <h2 style="color: #ffffff; font-weight: 300; margin-top: 0;">Nouă submisie formular de contact</h2>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <div style="margin-bottom: 20px;">
                <p style="color: #ec4899; font-weight: 600; margin-bottom: 5px;">Nume:</p>
                <p style="margin: 0;">${fromName}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="color: #ec4899; font-weight: 600; margin-bottom: 5px;">Email:</p>
                <p style="margin: 0;">${fromEmail}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="color: #ec4899; font-weight: 600; margin-bottom: 5px;">Subiect:</p>
                <p style="margin: 0;">${subject}</p>
              </div>
              
              <div>
                <p style="color: #ec4899; font-weight: 600; margin-bottom: 15px;">Mesaj:</p>
                <div style="background: rgba(0, 0, 0, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #ec4899;">${message.replace(/\n/g, '<br/>')}</div>
              </div>
            </div>
            
            <div style="text-align: center; font-size: 12px; color: #666666;">
              <p style="margin: 0;">© 2024 LOTUS. Toate drepturile rezervate.</p>
            </div>
          </div>
        </body>
      </html>
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