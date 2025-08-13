"use client"

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Calendar, MapPin, User, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
// Appwrite removed; booking is persisted server-side

interface PaymentSuccessData {
  txnid: string
  mihpayid?: string
  amount: string
  status: string
  productinfo: string
  email: string
  firstname: string
  bank_ref_num?: string
  mode?: string
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [emailStatus, setEmailStatus] = useState<{ attempted: boolean; provider: string | null; messageId: string | null; previewUrl: string | null; error: string | null } | null>(null)
  const processedRef = useRef(false)

  const txnid = params.txnid as string

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        console.log('🔍 Starting payment success processing for txnid:', txnid)
        
        // Get payment data from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const urlParamsObj = Object.fromEntries(urlParams.entries())
        console.log('📋 URL Parameters:', urlParamsObj)
        
        // Also check for data in localStorage
        const storedPaymentData = localStorage.getItem('paymentData')
        let storedData = null
        if (storedPaymentData) {
          try {
            storedData = JSON.parse(storedPaymentData)
            console.log('💾 Stored payment data found:', storedData)
          } catch (e) {
            console.log('❌ Failed to parse stored payment data:', e)
          }
        } else {
          console.log('❌ No stored payment data found in localStorage')
        }

        // Set debug info for troubleshooting
        setDebugInfo({
          txnid,
          urlParams: urlParamsObj,
          storedData: storedData,
          user: user ? { id: user.$id, email: user.email } : null
        })

        // Verify payment with backend
        const verificationResponse = await fetch(`/api/payment/verify/${txnid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...urlParamsObj,
            storedData
          })
        })

        if (!verificationResponse.ok) {
          throw new Error('Payment verification failed')
        }

        const verificationResult = await verificationResponse.json()
        console.log('✅ Payment verification result:', verificationResult)
        if (verificationResult?.emailStatus) {
          setEmailStatus(verificationResult.emailStatus)
        }

        // If verification failed, redirect to failure page
        if (verificationResult.status !== 'success') {
          router.push(`/payment/failure/${txnid}?error_message=${encodeURIComponent(verificationResult.error_message || 'Payment verification failed')}`)
          return
        }

        const paymentData: PaymentSuccessData = {
          txnid: verificationResult.txnid,
          mihpayid: verificationResult.mihpayid,
          amount: verificationResult.amount,
          status: verificationResult.status,
          productinfo: verificationResult.productinfo,
          email: verificationResult.email,
          firstname: verificationResult.firstname,
          bank_ref_num: verificationResult.bank_ref_num,
          mode: verificationResult.mode
        }

        console.log('📊 Final payment data:', paymentData)

        // If we have minimal data, try to create a booking
        if (paymentData.txnid) {
          let eventData = null
          
          // Try to parse product info
          // Prefer storedData.product (reliable) over parsing productinfo from query
          if (storedData?.product) {
            eventData = storedData.product
            console.log('✅ Using event data from stored data:', eventData)
          } else if (paymentData.productinfo) {
            // Best-effort: attempt to decode but never throw
            try {
              const raw = paymentData.productinfo as string
              const decoded = decodeURIComponent(raw.replace(/\+/g, ' '))
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&amp;/g, '&')
              const maybe = JSON.parse(decoded)
              if (maybe && typeof maybe === 'object') {
                eventData = maybe
              }
            } catch {
              // ignore
            }
          }

          // Create booking record with available data
          const bookingRecord = {
            user_id: user?.$id || 'guest',
            event_id: eventData?.eventId || 'unknown',
            event_name: eventData?.eventName || 'Event Booking',
            ticket_type: eventData?.ticketType || 'General',
            quantity: eventData?.quantity || 1,
            amount: parseFloat(paymentData.amount) || 0,
            currency: 'USD',
            payment_method: 'PayU',
            payment_status: 'completed',
            transaction_id: paymentData.txnid,
            mihpayid: paymentData.mihpayid,
            bank_ref_num: paymentData.bank_ref_num,
            payment_mode: paymentData.mode,
            booking_status: 'confirmed',
            customer_name: paymentData.firstname || 'Customer',
            customer_email: paymentData.email || 'customer@example.com',
            booking_date: new Date().toISOString(),
            event_date: eventData?.eventDate || new Date().toISOString(),
            event_location: eventData?.eventLocation || 'TBD'
          }

          console.log('💾 Attempting to create booking record:', bookingRecord)
          
          // Client-side DB write removed to avoid Appwrite schema errors.
          // The booking is persisted server-side in /api/payment/verify/[txnid].
          setBookingData({
            ...bookingRecord,
            $id: 'temp_' + Date.now(),
          })
        }

        // Clean up stored payment data
        localStorage.removeItem('paymentData')
        
        setLoading(false)

      } catch (error) {
        console.error('❌ Error processing payment success:', error)
        setError('Failed to process payment success: ' + (error as Error).message)
        setLoading(false)
      }
    }

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout reached, showing fallback success page')
        setLoading(false)
        setBookingData({
          $id: 'timeout_' + Date.now(),
          event_name: 'Event Booking',
          customer_name: 'Customer',
          customer_email: 'customer@example.com',
          amount: 0,
          transaction_id: txnid,
          event_date: new Date().toISOString(),
          event_location: 'TBD',
          error: 'Payment processed but data retrieval timed out'
        })
      }
    }, 10000) // 10 second timeout

    if (!txnid) return
    if (processedRef.current) return
    processedRef.current = true
    handlePaymentSuccess()

    return () => clearTimeout(timeout)
  }, [txnid, user, router])

  const handleDownloadTicket = () => {
    const ticketData = {
      bookingId: bookingData?.$id || 'N/A',
      eventName: bookingData?.event_name || 'Event',
      customerName: bookingData?.customer_name || 'Customer',
      eventDate: bookingData?.event_date || 'TBD',
      eventLocation: bookingData?.event_location || 'TBD',
      ticketType: bookingData?.ticket_type || 'General',
      quantity: bookingData?.quantity || 1,
      amount: bookingData?.amount || 0,
      transactionId: txnid,
      mihpayid: bookingData?.mihpayid || 'N/A',
      bankRefNum: bookingData?.bank_ref_num || 'N/A'
    }

    const ticketContent = `
TICKET CONFIRMATION
==================
Booking ID: ${ticketData.bookingId}
Event: ${ticketData.eventName}
Customer: ${ticketData.customerName}
Date: ${ticketData.eventDate}
Location: ${ticketData.eventLocation}
Ticket Type: ${ticketData.ticketType}
Quantity: ${ticketData.quantity}
Amount: $${ticketData.amount}
Transaction ID: ${ticketData.transactionId}
Payment ID: ${ticketData.mihpayid}
Bank Reference: ${ticketData.bankRefNum}

Thank you for your booking!
    `.trim()

    const blob = new Blob([ticketContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${ticketData.bookingId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Test Resend Mail removed per request

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Processing your payment...</p>
          <p className="mt-2 text-sm text-gray-500">Transaction ID: {txnid}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Payment Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Transaction ID:</strong> {txnid}</p>
              <p><strong>Status:</strong> Payment may have been successful</p>
            </div>
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your booking has been confirmed
          </p>
          {bookingData?.error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ {bookingData.error}
              </p>
            </div>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Transaction ID: {txnid}
              {bookingData?.mihpayid && (
                <> | Payment ID: {bookingData.mihpayid}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Event Date</p>
                  <p className="text-sm text-gray-600">{bookingData?.event_date || 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">{bookingData?.event_location || 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-gray-600">{bookingData?.customer_name || 'Customer'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{bookingData?.customer_email || 'customer@example.com'}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{bookingData?.amount || 0}
                </span>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && emailStatus && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  Email attempted: {String(emailStatus.attempted)} | Provider: {emailStatus.provider || 'n/a'}
                </p>
                {emailStatus.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {emailStatus.error}</p>
                )}
                {emailStatus.previewUrl && (
                  <p className="text-sm mt-1">
                    Preview: <a className="underline" href={emailStatus.previewUrl} target="_blank" rel="noreferrer">Open</a>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownloadTicket} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>
        </div>


        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
        </div>

        {/* Debug information (only show in development) */}
        {/* Debug Information commented out per request
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-sm">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
        */}
      </div>
    </div>
  )
}