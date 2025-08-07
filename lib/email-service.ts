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
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa !important; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
        .header h2 { margin: 0; font-size: 18px; font-weight: 300; opacity: 0.9; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .poem-highlight { 
          background-color: #f0fdf4; 
          border: 1px solid #22c55e; 
          border-left: 4px solid #22c55e; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
        }
        .poem-highlight h3 { margin: 0 0 10px 0; color: #15803d; font-size: 18px; }
        .poem-highlight p { margin: 0; color: #16a34a; font-weight: 500; }
        .button-container { text-align: center; margin: 30px 0; }
        .cta-button { 
          display: inline-block; 
          background-color: #22c55e; 
          color: white !important; 
          text-decoration: none; 
          padding: 15px 30px; 
          border-radius: 8px; 
          font-weight: 500; 
          font-size: 16px;
        }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
        .highlight { color: #22c55e; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🌸 LOTUS</h1>
          <h2>Poezia ta a fost aprobată!</h2>
        </div>
        
        <div class="content">
          <p><strong>Salut ${authorName},</strong></p>
          
          <p>Suntem bucuroși să te informăm că poezia ta a fost aprobată și este acum publicată pe LOTUS Poetry!</p>

          <div class="poem-highlight">
            <h3>"${poemTitle}"</h3>
            <p>✅ Status: Publicată</p>
          </div>

          <p>Cuvintele tale frumoase sunt acum live și pot fi descoperite de iubitorii de poezie din comunitatea noastră. Îți mulțumim că ne-ai împărtășit creativitatea!</p>

          <div class="button-container">
            <a href="${env.NEXTAUTH_URL}/poems" class="cta-button">Vezi poezia ta publicată</a>
          </div>

          <p>Continuă să scrii și să ne împărtășești munca ta uimitoare!</p>

          <p>Cu stimă,<br><span class="highlight">Echipa LOTUS Poetry</span></p>
        </div>
        
        <div class="footer">
          <p>© 2024 LOTUS Poetry. Toate drepturile rezervate.</p>
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
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa !important; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
        .header h2 { margin: 0; font-size: 18px; font-weight: 300; opacity: 0.9; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .poem-highlight { 
          background-color: #fefbf3; 
          border: 1px solid #f59e0b; 
          border-left: 4px solid #f59e0b; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
        }
        .poem-highlight h3 { margin: 0 0 10px 0; color: #d97706; font-size: 18px; }
        .poem-highlight p { margin: 0; color: #f59e0b; font-weight: 500; }
        .feedback-box { 
          background-color: #fefbf3; 
          border: 1px solid #f59e0b; 
          border-left: 4px solid #f59e0b; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
        }
        .feedback-box h4 { margin: 0 0 15px 0; color: #d97706; font-size: 16px; }
        .feedback-box p { margin: 0; color: #92400e; line-height: 1.6; }
        .button-container { text-align: center; margin: 30px 0; }
        .cta-button { 
          display: inline-block; 
          background-color: #f59e0b; 
          color: white !important; 
          text-decoration: none; 
          padding: 15px 30px; 
          border-radius: 8px; 
          font-weight: 500; 
          font-size: 16px;
        }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
        .highlight { color: #f59e0b; font-weight: 600; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🌸 LOTUS</h1>
          <h2>Actualizare privind submisia poeziei</h2>
        </div>
        
        <div class="content">
          <p><strong>Salut ${authorName},</strong></p>
          
          <p>Îți mulțumim că ai trimis poezia ta la LOTUS Poetry. După o analiză atentă, am decis să nu publicăm această submisie în acest moment.</p>

          <div class="poem-highlight">
            <h3>"${poemTitle}"</h3>
            <p>Status: Nu a fost aprobată pentru publicare</p>
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

          <div class="button-container">
            <a href="${env.NEXTAUTH_URL}/submit" class="cta-button">Trimite altă poezie</a>
          </div>

          <p>Credem că fiecare poet are ceva valoros de împărtășit și așteptăm cu nerăbdare să vedem mai multe din lucrul tău!</p>

          <p>Continuă să scrii,<br><span class="highlight">Echipa LOTUS Poetry</span></p>
        </div>
        
        <div class="footer">
          <p>© 2024 LOTUS Poetry. Toate drepturile rezervate.</p>
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
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa !important; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #ec4899, #be185d); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
          .header h2 { margin: 0; font-size: 18px; font-weight: 300; opacity: 0.9; }
          .content { padding: 30px; color: #333333; line-height: 1.6; }
          .field-group { margin-bottom: 20px; }
          .field-label { color: #ec4899; font-weight: 600; margin-bottom: 5px; }
          .field-value { margin: 0; }
          .message-box { 
            background-color: #fdf2f8; 
            border: 1px solid #ec4899; 
            border-left: 4px solid #ec4899; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 15px;
          }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🌸 LOTUS</h1>
            <h2>Nouă submisie formular de contact</h2>
          </div>
          
          <div class="content">
            <div class="field-group">
              <p class="field-label">Nume:</p>
              <p class="field-value"><strong>${fromName}</strong></p>
            </div>
            
            <div class="field-group">
              <p class="field-label">Email:</p>
              <p class="field-value"><strong>${fromEmail}</strong></p>
            </div>
            
            <div class="field-group">
              <p class="field-label">Subiect:</p>
              <p class="field-value"><strong>${subject}</strong></p>
            </div>
            
            <div>
              <p class="field-label">Mesaj:</p>
              <div class="message-box">${message.replace(/\n/g, '<br/>')}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 LOTUS Poetry. Toate drepturile rezervate.</p>
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

// Email template for password reset
function createPasswordResetEmailTemplate(userName: string, resetUrl: string) {
  const subject = "Resetare parolă LOTUS"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa !important; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #ec4899, #be185d); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
        .header h2 { margin: 0; font-size: 18px; font-weight: 300; opacity: 0.9; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .button-container { text-align: center; margin: 30px 0; }
        .reset-button { 
          display: inline-block; 
          background-color: #ec4899; 
          color: white !important; 
          text-decoration: none; 
          padding: 15px 30px; 
          border-radius: 8px; 
          font-weight: 500; 
          font-size: 16px;
        }
        .url-box { 
          background-color: #f8f9fa; 
          border: 1px solid #e9ecef; 
          padding: 15px; 
          border-radius: 8px; 
          word-break: break-all; 
          font-size: 14px; 
          margin: 20px 0;
          border-left: 4px solid #ec4899;
        }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
        .highlight { color: #ec4899; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🌸 LOTUS</h1>
          <h2>Resetare parolă</h2>
        </div>
        
        <div class="content">
          <p><strong>Salut ${userName},</strong></p>
          
          <p>Ai solicitat resetarea parolei pentru contul tău LOTUS. Dacă nu ai făcut această solicitare, poți ignora acest email.</p>
          
          <p>Pentru a-ți reseta parola, dă click pe butonul de mai jos:</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="reset-button">Resetează parola</a>
          </div>
          
          <p style="font-size: 14px; color: #666666;">Dacă butonul nu funcționează, poți copia și lipi următorul link în browser:</p>
          
          <div class="url-box">
            ${resetUrl}
          </div>
          
          <p style="font-size: 14px; color: #666666;">
            Acest link va expira în <span class="highlight">1 oră</span>.
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 LOTUS Poetry. Toate drepturile rezervate.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Salut ${userName},

    Ai solicitat resetarea parolei pentru contul tău LOTUS. Dacă nu ai făcut această solicitare, poți ignora acest email.

    Pentru a-ți reseta parola, vizitează următorul link:
    ${resetUrl}

    Acest link va expira în 1 oră.

    Cu stimă,
    Echipa LOTUS Poetry
  `

  return { subject, html, text }
}

// Send password reset email
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter()
    const { subject, html, text } = createPasswordResetEmailTemplate(userName, resetUrl)

    const mailOptions = {
      from: `"LOTUS Poetry" <${env.SMTP_FROM || env.SMTP_USER}>`,
      to: userEmail,
      subject,
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent successfully to ${userEmail}`)

    return { success: true }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send password reset email'
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