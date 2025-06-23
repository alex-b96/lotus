# Email Notifications Setup Guide

## Overview
The LOTUS Poetry website now includes email notifications for authors when their poems are approved or rejected by administrators.

## Required Environment Variables

Add these variables to your `.env` file to enable email notifications:

```bash
# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com          # Gmail SMTP server (or your provider's SMTP)
SMTP_PORT=587                     # Port for TLS/STARTTLS (use 465 for SSL)
SMTP_SECURE=false                 # Set to 'true' for SSL (port 465), 'false' for TLS (port 587)

# Email Authentication
SMTP_USER=your-email@gmail.com    # Your email address for sending notifications
SMTP_PASS=your-app-password       # Your email app password (NOT your regular password)
SMTP_FROM=your-email@gmail.com    # From address for outgoing emails (usually same as SMTP_USER)
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification
   - Follow the setup process to enable 2FA

2. **Generate an App Password**
   - Go to Google Account > Security > 2-Step Verification
   - Scroll down to "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Configure Environment Variables**
   ```bash
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd-efgh-ijkl-mnop    # Your 16-character app password
   SMTP_FROM=your-email@gmail.com
   ```

## Alternative Email Providers

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=your-verified-sender@domain.com
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
SMTP_FROM=postmaster@your-domain.mailgun.org
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-outlook-password
SMTP_FROM=your-email@outlook.com
```

## Email Templates

The system includes two email templates:

### Approval Email
- **Subject**: `🎉 Your poem "[Title]" has been approved!`
- **Content**: Congratulatory message with link to view published poem
- **Styling**: Green theme matching LOTUS branding

### Rejection Email
- **Subject**: `Update on your poem submission: "[Title]"`
- **Content**: Encouraging message with optional reviewer feedback
- **Styling**: Orange theme with constructive messaging

## Features

- **HTML and Plain Text**: Both email formats supported for compatibility
- **Responsive Design**: Emails display well on mobile and desktop
- **Error Handling**: Graceful degradation if email service fails
- **Logging**: Comprehensive logging for troubleshooting
- **Security**: No sensitive data exposed in email content

## Testing

To test the email configuration:

1. Set up your environment variables
2. Start the development server: `npm run dev`
3. Log in as an admin user
4. Submit a test poem and approve/reject it
5. Check the author's email for the notification

## Production Considerations

- Use a dedicated email service (SendGrid, Mailgun, AWS SES) for production
- Set up proper SPF, DKIM, and DMARC records for better deliverability
- Monitor email delivery rates and bounce handling
- Consider email preferences and unsubscribe functionality

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check that 2FA is enabled and app password is correct
   - Verify SMTP_USER and SMTP_PASS are set correctly

2. **Connection Timeout**
   - Check SMTP_HOST and SMTP_PORT settings
   - Verify firewall isn't blocking SMTP traffic

3. **Emails Not Delivered**
   - Check spam folders
   - Verify sender reputation and domain authentication
   - Review email service logs

### Debug Mode

Enable debug logging by checking the server console for email-related messages during approval/rejection actions.