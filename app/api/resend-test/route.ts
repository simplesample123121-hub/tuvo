import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL_CONFIG, DEV_EMAIL_OVERRIDES } from '@/lib/email.config'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, from } = await req.json()
    if (!to) return NextResponse.json({ ok: false, error: 'Missing "to"' }, { status: 400 })

    const apiKey = DEV_EMAIL_OVERRIDES.RESEND_API_KEY || EMAIL_CONFIG.RESEND_API_KEY
    const fromAddr = from || DEV_EMAIL_OVERRIDES.RESEND_FROM || EMAIL_CONFIG.RESEND_FROM || 'Acme <onboarding@resend.dev>'
    if (!apiKey) return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not configured' }, { status: 500 })

    const resend = new Resend(apiKey)
    let result: any
    try {
      result = await resend.emails.send({
        from: fromAddr,
        to: Array.isArray(to) ? to : [to],
        subject: subject || 'Resend test email',
        html: html || '<p><strong>It works!</strong> Sent via Resend SDK per official docs.</p>',
      })
    } catch (sdkError: any) {
      console.error('Resend SDK error:', sdkError)
      return NextResponse.json({ ok: false, error: sdkError?.message || 'SDK failed' }, { status: 500 })
    }

    // If the SDK throws, we won't get here. If it returns an error shape, surface it.
    if ((result as any)?.error) {
      console.error('Resend API error:', (result as any).error)
      return NextResponse.json({ ok: false, error: (result as any).error?.message || 'Unknown error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: (result as any)?.id })
  } catch (e: any) {
    console.error('Resend test route error:', e)
    return NextResponse.json({ ok: false, error: e.message || 'Failed to send' }, { status: 500 })
  }
}


