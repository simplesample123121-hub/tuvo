import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUPayment } from '@/lib/payu.config'
import { generateQRCode } from '@/lib/utils'
import { createSupabaseServerClient } from '@/lib/supabase'
import { sendMail } from '@/lib/email'
import { generateTicketPdfBuffer } from '@/lib/ticket-pdf'
import QRCode from 'qrcode'

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
    const normalizedAmount = (() => {
      const val = (verificationResult as any)?.amount ?? (verificationResult as any)?.amt ?? amount
      const n = Number(val)
      return Number.isFinite(n) ? n : Number.parseFloat(String(val || '0')) || 0
    })()

    const responseData = {
      txnid,
      mihpayid: verificationResult.mihpayid || mihpayid,
      status: verificationResult.status,
      amount: normalizedAmount,
      productinfo: verificationResult.productinfo || productinfo,
      firstname: verificationResult.firstname || firstname,
      email: verificationResult.email || email,
      error_message: verificationResult.error_message || error_Message,
      bank_ref_num: verificationResult.bank_ref_num,
      mode: verificationResult.mode,
      udf1: (verificationResult as any).udf1,
      udf2: (verificationResult as any).udf2,
      udf3: (verificationResult as any).udf3,
      udf4: (verificationResult as any).udf4,
      udf5: (verificationResult as any).udf5,
    }

    // Track email sending outcome for diagnostics
    let emailAttempted = false
    let emailProvider: 'resend' | 'smtp' | null = null
    let emailMessageId: string | null = null
    let emailPreviewUrl: string | null = null
    let emailError: string | null = null

    // If success, persist booking to Supabase (server-side)
    if (responseData.status === 'success') {
      try {
        // Create client and perform idempotency check first
        const sb = createSupabaseServerClient()
        const { data: existingBooking } = await sb
          .from('bookings')
          .select('id')
          .eq('id', responseData.txnid)
          .maybeSingle()

        const bookingAlreadyExists = !!existingBooking

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
        const product = {
          ...(parsedProduct || {}),
          ...(storedData?.product || {}),
          // Prefer server-sourced UDFs for critical IDs
          eventId: responseData.udf1 || (parsedProduct?.eventId) || (storedData?.product?.eventId) || 'unknown',
          userId: responseData.udf2 || (parsedProduct?.userId) || (storedData?.product?.userId) || 'guest',
          ticketType: responseData.udf3 || (parsedProduct?.ticketType) || (storedData?.product?.ticketType) || 'General',
          quantity: Number(responseData.udf4 || (parsedProduct?.quantity) || (storedData?.product?.quantity) || 1),
        }

        const bookingRecord: any = {
          event_id: String(product?.eventId || 'unknown'),
          attendee_name: String(product?.attendeeName || responseData.firstname || 'Customer'),
          attendee_email: String(product?.attendeeEmail || responseData.email || 'customer@example.com'),
          attendee_phone: String(product?.attendeePhone || phone || '0000000000'),
          attendee_gender: String(product?.attendeeGender || 'NA'),
          attendee_age: Number(product?.attendeeAge || 0),
          attendee_address: String(product?.attendeeAddress || 'N/A'),
          payment_status: 'completed',
          payment_amount: Number(responseData.amount || storedData?.amount || 0) || 0,
          payment_method: 'PayU',
          qr_code: generateQRCode(responseData.txnid),
          status: 'confirmed',
          user_id: String(product?.userId || 'guest'),
          notes: String(product?.eventName || ''),
          ticket_type: String(product?.ticketType || 'General'),
        }

        // Insert or update the booking once. Using upsert still, but email will only send on first insert.
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

        // If booking already existed, do not send duplicate emails
        if (bookingAlreadyExists) {
          return NextResponse.json({
            ...responseData,
            emailStatus: {
              attempted: false,
              provider: null,
              messageId: null,
              previewUrl: null,
              error: null,
            },
          })
        }

        // Fetch event to get image and venue for email/ticket
        const { data: eventRow } = await sb
          .from('events')
          .select('*')
          .eq('id', bookingRecord.event_id)
          .maybeSingle()

        // Generate QR PNG for PDF
        const qrPngBase64 = await QRCode.toDataURL(String(bookingRecord.qr_code), { width: 256 })

        // Create PDF buffer (best-effort)
        let pdfBuffer: Buffer | null = null
        try {
          pdfBuffer = await generateTicketPdfBuffer({
            bookingId: responseData.txnid,
            eventName: bookingRecord.notes || (eventRow as any)?.name || 'Event',
            eventDate: (eventRow as any)?.date || new Date().toISOString(),
            eventLocation: (eventRow as any)?.venue || 'TBD',
            customerName: bookingRecord.attendee_name,
            customerEmail: bookingRecord.attendee_email,
            ticketType: bookingRecord.ticket_type,
            quantity: 1,
            amount: bookingRecord.payment_amount,
            imageUrl: (eventRow as any)?.image_url,
            qrPngBase64,
          })
        } catch (pdfErr) {
          console.error('Ticket PDF generation failed:', pdfErr)
        }

        // Send email (best-effort)
        try {
          const mailResult = await sendMail({
            to: bookingRecord.attendee_email,
            subject: `Your ticket for ${bookingRecord.notes || (eventRow as any)?.name || 'Event'}`,
            html: `<p>Hi ${bookingRecord.attendee_name},</p>
                   <p>Thank you for your booking. Your ticket is attached.</p>
                   <p><strong>Booking ID:</strong> ${responseData.txnid}</p>
                   <p>Enjoy the event!</p>`,
            attachments: pdfBuffer ? [
              { filename: `ticket-${responseData.txnid}.pdf`, content: pdfBuffer, contentType: 'application/pdf' },
            ] : undefined,
          })
          emailAttempted = true
          emailProvider = mailResult.provider
          emailMessageId = mailResult.messageId
          emailPreviewUrl = mailResult.previewUrl || null
        } catch (mailErr) {
          console.error('Email send failed:', mailErr)
          emailAttempted = true
          emailError = (mailErr as any)?.message || 'Failed to send email'
        }
      } catch (e) {
        console.error('Failed to persist booking to Supabase:', e)
      }
    }

    // Return the verification result
    return NextResponse.json({
      ...responseData,
      emailStatus: {
        attempted: emailAttempted,
        provider: emailProvider,
        messageId: emailMessageId,
        previewUrl: emailPreviewUrl,
        error: emailError,
      },
    })
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