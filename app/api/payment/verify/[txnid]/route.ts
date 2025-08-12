import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUPayment } from '@/lib/payu.config'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ txnid: string }> }
) {
  try {
    const { txnid } = await context.params

    // Get payment data from request body
    const body = await request.json()
    const { mihpayid, status, amount, productinfo, firstname, email, error_Message } = body

    // Verify the payment with PayU
    const verificationResult = await verifyPayUPayment(txnid)

    // Prepare response data
    const responseData = {
      txnid,
      mihpayid: verificationResult.mihpayid || mihpayid,
      status: verificationResult.status,
      amount: verificationResult.amount || amount,
      productinfo: verificationResult.productinfo || productinfo,
      firstname: verificationResult.firstname || firstname,
      email: verificationResult.email || email,
      error_message: verificationResult.error_message || error_Message,
      bank_ref_num: verificationResult.bank_ref_num,
      mode: verificationResult.mode,
    }

    // Return the verification result
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}