import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { EMAIL_CONFIG, DEV_EMAIL_OVERRIDES } from './email.config'

export interface MailOptions {
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: { filename: string; content: Buffer; contentType?: string }[]
}

export async function getMailTransport() {
  // Production: use configured SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  // Dev fallback: auto-provision Ethereal test account
  if (process.env.NODE_ENV !== 'production') {
    const test = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    })
  }
  throw new Error('Email transport not configured')
}

export async function sendMail(options: MailOptions): Promise<{ messageId: string; previewUrl?: string; provider: 'resend' | 'smtp' }> {
  // Prefer Resend if configured
  const resolvedResendKey = DEV_EMAIL_OVERRIDES.RESEND_API_KEY || EMAIL_CONFIG.RESEND_API_KEY
  const resolvedFrom = DEV_EMAIL_OVERRIDES.RESEND_FROM || EMAIL_CONFIG.RESEND_FROM || EMAIL_CONFIG.SMTP_FROM || 'no-reply@tuvo.com'

  if (resolvedResendKey) {
    const resend = new Resend(resolvedResendKey)
    const from = resolvedFrom
    const result = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html || options.text || '',
      text: options.text,
      // Resend expects attachments as base64 strings
      attachments: options.attachments?.map(a => ({
        filename: a.filename,
        content: (a.content instanceof Buffer ? a.content : Buffer.from(a.content as any)).toString('base64'),
        encoding: 'base64',
        type: a.contentType || 'application/octet-stream',
      }))
    })
    return { messageId: (result as any)?.id || 'resend', provider: 'resend' }
  }

  // Fallback to SMTP transport
  const transporter = await getMailTransport()
  const from = EMAIL_CONFIG.SMTP_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@tuvo.com'
  const info = await transporter.sendMail({ from, ...options })
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Email preview URL:', nodemailer.getTestMessageUrl(info))
  }
  return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) || undefined, provider: 'smtp' }
}


