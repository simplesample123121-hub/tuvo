import { NextRequest, NextResponse } from 'next/server'

function resolveBaseUrl(request: NextRequest) {
  const origin = new URL(request.url).origin
  const envBase = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
  return envBase || origin
}

export async function POST(request: NextRequest, context: { params: Promise<{ txnid: string }> }) {
  try {
    const { txnid } = await context.params
    const form = await request.formData()
    const search = new URLSearchParams()
    for (const [key, value] of form.entries()) search.append(key, String(value))
    const base = resolveBaseUrl(request)
    return NextResponse.redirect(`${base}/payment/failure/${txnid}?${search.toString()}`, { status: 302 })
  } catch {
    const base = resolveBaseUrl(request)
    const { txnid } = await context.params
    return NextResponse.redirect(`${base}/payment/failure/${txnid}`, { status: 302 })
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ txnid: string }> }) {
  const { txnid } = await context.params
  const base = resolveBaseUrl(request)
  const url = new URL(request.url)
  const qs = url.search ? url.search : ''
  return NextResponse.redirect(`${base}/payment/failure/${txnid}${qs}`, { status: 302 })
}
