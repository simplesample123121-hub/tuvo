import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUPayment } from '@/lib/payu.config'
import { generateQRCode } from '@/lib/utils'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ txnid: string }> }
) {
  try {
    const { txnid } = await context.params

    // Get payment data from request body
    const body = await request.json()
    const { mihpayid, status, amount, productinfo, firstname, email, phone, error_Message, storedData } = body

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

    // If success, persist booking to Supabase (server-side)
    if (responseData.status === 'success') {
      try {
        // Build booking record (prefer stored product from client)
        const decodeProduct = (val?: string) => {
          if (!val) return null
          try {
            const decoded = decodeURIComponent(String(val).replace(/\+/g, ' '))
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .replace(/&amp;/g, '&')
            return JSON.parse(decoded)
          } catch {
            return null
          }
        }

        const parsedProduct = decodeProduct(responseData.productinfo)
        const product = parsedProduct || storedData?.product || {}

        const bookingRecord: any = {
          event_id: String(product?.eventId || 'unknown'),
          attendee_name: String(product?.attendeeName || responseData.firstname || 'Customer'),
          attendee_email: String(product?.attendeeEmail || responseData.email || 'customer@example.com'),
          attendee_phone: String(product?.attendeePhone || phone || '0000000000'),
          attendee_gender: String(product?.attendeeGender || 'NA'),
          attendee_age: Number(product?.attendeeAge || 0),
          attendee_address: String(product?.attendeeAddress || 'N/A'),
          payment_status: 'completed',
          payment_amount: parseFloat(String(responseData.amount || storedData?.amount || '0')) || 0,
          payment_method: 'PayU',
          qr_code: generateQRCode(responseData.txnid),
          status: 'confirmed',
          user_id: String(product?.userId || 'guest'),
          notes: String(product?.eventName || ''),
          ticket_type: String(product?.ticketType || 'General'),
        }

        const sb = createSupabaseServerClient()
        const { error } = await sb.from('bookings').upsert({
          id: responseData.txnid,
          event_id: bookingRecord.event_id,
          user_id: bookingRecord.user_id,
          attendee_name: bookingRecord.attendee_name,
          attendee_email: bookingRecord.attendee_email,
          attendee_phone: bookingRecord.attendee_phone,
          attendee_gender: bookingRecord.attendee_gender,
          attendee_age: bookingRecord.attendee_age,
          attendee_address: bookingRecord.attendee_address,
          payment_status: 'completed',
          payment_amount: bookingRecord.payment_amount,
          payment_method: 'PayU',
          qr_code: bookingRecord.qr_code,
          status: 'confirmed',
          ticket_type: bookingRecord.ticket_type,
          notes: bookingRecord.notes,
        }, { onConflict: 'id' })
        if (error) throw error
      } catch (e) {
        console.error('Failed to persist booking to Supabase:', e)
      }
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