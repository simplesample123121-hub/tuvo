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

    // Return the HTML form directly as text
    return new Response(data, {
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