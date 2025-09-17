"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, RefreshCw, Mail, ArrowLeft, AlertTriangle } from 'lucide-react'

interface PaymentFailureData {
  txnid: string
  mihpayid?: string
  amount: string
  status: string
  error_message: string
  productinfo: string
  bank_ref_num?: string
  mode?: string
}

export default function PaymentFailurePage() {
  const params = useParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<PaymentFailureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>({})

  const txnid = params.txnid as string

  useEffect(() => {
    const handlePaymentFailure = async () => {
      try {
        console.log('🔍 Processing payment failure for txnid:', txnid)

        // Get payment data from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const urlParamsObj = Object.fromEntries(urlParams.entries())
        console.log('📋 URL Parameters:', urlParamsObj)

        // Check for stored data
        const storedPaymentData = localStorage.getItem('paymentData')
        let storedData = null
        if (storedPaymentData) {
          try {
            storedData = JSON.parse(storedPaymentData)
            console.log('💾 Stored payment data found:', storedData)
          } catch (e) {
            console.log('❌ Failed to parse stored payment data:', e)
          }
        }

        // Set debug info
        setDebugInfo({
          txnid,
          urlParams: urlParamsObj,
          storedData
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
          if (verificationResponse.status === 409) {
            // Sold out: show friendly message and guide back to booking
            const data = await verificationResponse.json().catch(() => ({} as any))
            setPaymentData({
              txnid,
              amount: urlParamsObj.amount || '0',
              status: 'failed',
              error_message: 'Sold out for selected quantity. Please reduce the number of tickets and try again.',
              productinfo: urlParamsObj.productinfo || ''
            } as any)
            setLoading(false)
            // Keep storedData so user can retry with same details from booking page
            return
          }
          throw new Error('Payment verification failed')
        }

        const verificationResult = await verificationResponse.json()
        console.log('✅ Payment verification result:', verificationResult)

        // If verification shows success, redirect to success page
        if (verificationResult.status === 'success') {
          router.push(`/payment/success/${txnid}`)
          return
        }

        const data: PaymentFailureData = {
          txnid: verificationResult.txnid,
          mihpayid: verificationResult.mihpayid,
          amount: verificationResult.amount || urlParams.get('amount') || '',
          status: verificationResult.status || 'failed',
          error_message: verificationResult.error_message || urlParams.get('error_message') || 'Payment failed',
          productinfo: verificationResult.productinfo || urlParams.get('productinfo') || '',
          bank_ref_num: verificationResult.bank_ref_num,
          mode: verificationResult.mode
        }

        setPaymentData(data)
        setLoading(false)

        // Clean up stored payment data
        localStorage.removeItem('paymentData')
      } catch (error) {
        console.error('Error processing payment failure:', error)
        setPaymentData({
          txnid,
          amount: '0',
          status: 'failed',
          error_message: 'Failed to process payment failure: ' + (error as Error).message,
          productinfo: ''
        })
        setLoading(false)
      }
    }

    if (txnid) {
      handlePaymentFailure()
    }
  }, [txnid, router])

  const handleRetryPayment = () => {
    // Parse product info to get event details for retry
    if (paymentData?.productinfo) {
      try {
        const raw = paymentData.productinfo as string
        const decoded = decodeURIComponent(raw.replace(/\+/g, ' '))
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
        const eventData = JSON.parse(decoded)
        // Navigate back to booking page with event ID
        router.push(`/events/${eventData.eventId}/book`)
      } catch (e) {
        console.error('Failed to parse product info for retry:', e)
        router.push('/events')
      }
    } else {
      router.push('/events')
    }
  }

  const handleContactSupport = () => {
    // Open email client with support details
    const subject = encodeURIComponent(`Payment Failure - Transaction ID: ${txnid}`)
    const body = encodeURIComponent(`
Hello Support Team,

I encountered a payment failure with the following details:

Transaction ID: ${txnid}
Payment ID: ${paymentData?.mihpayid || 'N/A'}
Amount: $${paymentData?.amount}
Error: ${paymentData?.error_message}
Bank Reference: ${paymentData?.bank_ref_num || 'N/A'}
Payment Mode: ${paymentData?.mode || 'N/A'}

Please help me resolve this issue.

Thank you.
    `)
    
    window.open(`mailto:support@tuvo.in?subject=${subject}&body=${body}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Processing payment status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We couldn't process your payment
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Transaction ID: {txnid}
              {paymentData?.mihpayid && (
                <> | Payment ID: {paymentData.mihpayid}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Error Details</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {paymentData?.error_message || 'Payment processing failed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
             <p className="text-lg font-semibold">₹{paymentData?.amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg font-semibold text-red-600">Failed</p>
              </div>
              {paymentData?.bank_ref_num && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Bank Reference</p>
                  <p className="text-lg font-semibold">{paymentData.bank_ref_num}</p>
                </div>
              )}
              {paymentData?.mode && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Mode</p>
                  <p className="text-lg font-semibold">{paymentData.mode}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              What went wrong?
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card details entered incorrectly</li>
              <li>• Network connectivity issues</li>
              <li>• Payment gateway temporary unavailability</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleRetryPayment} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={handleContactSupport} variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>

          <div className="text-center">
            <Button onClick={() => router.push('/events')} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse More Events
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team at support@tuvo.in</p>
          <p>Or call us at +1 (555) 123-4567</p>
        </div>

        {/* Debug information (only show in development) */}
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
      </div>
    </div>
  )
}