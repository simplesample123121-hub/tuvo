import { NextRequest, NextResponse } from 'next/server'
import { createPayUTransaction } from '@/lib/payu.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, product, firstname, email, mobile } = body

    // Validate required fields
    if (!amount || !product || !firstname || !email || !mobile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create PayU transaction (matching the working implementation)
    const data = await createPayUTransaction({
      amount,
      productinfo: JSON.stringify(product), // This matches the working implementation
      firstname,
      email,
      mobile
    })

    console.log('PayU transaction created:', data)

    // PayU should return an HTML form that redirects to the payment gateway
    // For now, return a mock HTML form since we're using mock PayU
    const htmlForm = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to Payment Gateway...</title>
      </head>
      <body>
                 <form id="payment_post" method="post" action="https://test.payu.in/_payment">
                     <input type="hidden" name="key" value="${process.env.PAYU_KEY || 'YtZVuv'}" />
          <input type="hidden" name="txnid" value="${data.txnid}" />
          <input type="hidden" name="amount" value="${amount}" />
          <input type="hidden" name="productinfo" value="${JSON.stringify(product)}" />
          <input type="hidden" name="firstname" value="${firstname}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="phone" value="${mobile}" />
          <input type="hidden" name="surl" value="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify/${data.txnid}" />
          <input type="hidden" name="furl" value="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify/${data.txnid}" />
                     <input type="hidden" name="hash" value="${data.hash}" />
        </form>
        <script>
          document.getElementById('payment_post').submit();
        </script>
        <p>Redirecting to payment gateway...</p>
      </body>
      </html>
    `

    return new Response(htmlForm, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error: any) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { 
        error: 'Payment initiation failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
} 