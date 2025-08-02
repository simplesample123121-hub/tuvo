"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PaymentStatus {
  status: string
  amount: string
  txnid: string
  method: string
  error: string
  created_at: string
}

export default function PaymentStatusPage() {
  const params = useParams()
  const router = useRouter()
  const { status, id } = params as { status: string; id: string }
  const [paymentData, setPaymentData] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment/verify/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPaymentData(data)
        }
      } catch (error) {
        console.error('Error fetching payment status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentStatus()
  }, [id])

  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'failure':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />
      default:
        return <AlertCircle className="w-16 h-16 text-gray-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'Payment Successful!'
      case 'failure':
        return 'Payment Failed'
      case 'pending':
        return 'Payment Pending'
      default:
        return 'Payment Status'
    }
  }

  const getStatusDescription = () => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'Your payment has been processed successfully. You will receive a confirmation email shortly.'
      case 'failure':
        return 'Your payment could not be processed. Please try again or contact support.'
      case 'pending':
        return 'Your payment is being processed. Please wait for confirmation.'
      default:
        return 'Payment status is being verified.'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying payment status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {getStatusIcon()}
          <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentData && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">{paymentData.txnid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span>₹{paymentData.amount}</span>
              </div>
              {paymentData.method && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{paymentData.method}</span>
                </div>
              )}
              {paymentData.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{paymentData.created_at}</span>
                </div>
              )}
              {paymentData.error && (
                <div className="pt-2 border-t">
                  <p className="text-red-600 text-sm">{paymentData.error}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link href="/events">
                Browse Events
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 