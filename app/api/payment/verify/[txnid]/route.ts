import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUPayment } from '@/lib/payu.config'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ txnid: string }> }
) {
  try {
    const { txnid } = await context.params

    // Verify the payment with PayU
    const data = await verifyPayUPayment(txnid)

    // Redirect to frontend with payment status
    const status = data.status
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/${status}/${txnid}`

    return NextResponse.redirect(redirectUrl)
  } catch (error: any) {
    console.error('Payment verification error:', error)
    
    // Redirect to failure page
    const params = await context.params
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure/${params.txnid}`
    return NextResponse.redirect(redirectUrl)
  }
} 