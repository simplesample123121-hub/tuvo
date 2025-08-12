import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { PAYU_CONFIG } from '@/lib/payu.config'

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
  const hasEmailConfig = !!(
    process.env.SENDGRID_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER)
  )
  result.email = hasEmailConfig ? 'configured' : 'not_configured'

  return NextResponse.json(result)
}


