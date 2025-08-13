import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json()
    if (!to) return NextResponse.json({ error: 'Missing to' }, { status: 400 })
    const { messageId, previewUrl, provider } = await sendMail({
      to,
      subject: 'Tuvo test email',
      html: `<p>This is a test email from Tuvo.</p>
             <p>Provider: ${process.env.RESEND_API_KEY ? 'Resend' : 'SMTP/Ethereal'}</p>
             <p>From: ${process.env.RESEND_FROM || process.env.SMTP_FROM || 'no-reply@tuvo.com'}</p>`,
    })
    return NextResponse.json({ ok: true, messageId, previewUrl, provider, usedResend: !!process.env.RESEND_API_KEY })
  } catch (e: any) {
    console.error('Test email error:', e)
    return NextResponse.json({ ok: false, error: e.message || 'Failed to send' }, { status: 500 })
  }
}


