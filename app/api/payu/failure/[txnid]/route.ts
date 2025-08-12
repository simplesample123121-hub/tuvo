import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, context: { params: Promise<{ txnid: string }> }) {
  try {
    const { txnid } = await context.params
    const form = await request.formData()
    const search = new URLSearchParams()
    for (const [key, value] of form.entries()) search.append(key, String(value))
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/payment/failure/${txnid}?${search.toString()}`, { status: 302 })
  } catch {
    const origin = new URL(request.url).origin
    const { txnid } = await context.params
    return NextResponse.redirect(`${origin}/payment/failure/${txnid}`, { status: 302 })
  }
}


