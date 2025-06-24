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
