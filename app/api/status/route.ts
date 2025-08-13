import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { PAYU_CONFIG } from '@/lib/payu.config'
import { EMAIL_CONFIG, DEV_EMAIL_OVERRIDES } from '@/lib/email.config'

export async function GET() {
  const result: any = {
    platform: 'ok',
    database: 'unknown',
    payment: 'unknown',
    email: 'unknown',
    timestamp: new Date().toISOString(),
  }

  // Database check (Supabase)
  try {
    const sb = createSupabaseServerClient()
    const { error } = await sb.from('events').select('id', { head: true, count: 'exact' }).limit(1)
    result.database = error ? 'error' : 'ok'
  } catch {
    result.database = 'error'
  }

  // Payment gateway reachability (HEAD to PayU base URL)
  try {
    const res = await fetch(PAYU_CONFIG.baseURL, { method: 'HEAD', cache: 'no-store' })
    result.payment = res.ok ? 'ok' : 'error'
  } catch {
    result.payment = 'error'
  }

  // Email configuration presence
  const hasResend = !!(DEV_EMAIL_OVERRIDES.RESEND_API_KEY || EMAIL_CONFIG.RESEND_API_KEY)
  const hasSmtp = !!(
    EMAIL_CONFIG.SMTP_HOST && EMAIL_CONFIG.SMTP_USER && (process.env.SMTP_PASS || EMAIL_CONFIG.SMTP_PASS)
  )
  result.email = hasResend ? 'resend_configured' : hasSmtp ? 'smtp_configured' : 'not_configured'

  return NextResponse.json(result)
}


