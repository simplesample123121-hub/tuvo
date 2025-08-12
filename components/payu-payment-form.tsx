"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PayUPaymentFormProps {
  bookingData: {
    eventId: string
    eventName: string
    eventDate?: string
    eventLocation?: string
    attendeeName: string
    attendeeEmail: string
    attendeePhone: string
    attendeeGender?: string
    attendeeAge?: number
    attendeeAddress?: string
    ticketType: string
    quantity: number
    amount: number
    bookingId: string
  }
  onPaymentComplete: (success: boolean, transactionId?: string) => void
}

export function PayUPaymentForm({ bookingData, onPaymentComplete }: PayUPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [paymentForm, setPaymentForm] = useState('')
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Store payment data in localStorage for success/failure pages
      const paymentData = {
        amount: bookingData.amount,
        product: {
          eventId: bookingData.eventId,
          eventName: bookingData.eventName,
          eventDate: bookingData.eventDate || '',
          eventLocation: bookingData.eventLocation || '',
          ticketType: bookingData.ticketType,
          quantity: bookingData.quantity,
          attendeeName: bookingData.attendeeName,
          attendeeEmail: bookingData.attendeeEmail,
          attendeePhone: bookingData.attendeePhone,
          attendeeGender: bookingData.attendeeGender,
          attendeeAge: bookingData.attendeeAge,
          attendeeAddress: bookingData.attendeeAddress,
          bookingId: bookingData.bookingId
        },
        firstname: bookingData.attendeeName,
        email: bookingData.attendeeEmail,
        mobile: bookingData.attendeePhone
      }

      // Store payment data in localStorage
      localStorage.setItem('paymentData', JSON.stringify({
        amount: bookingData.amount,
        productinfo: JSON.stringify(paymentData.product),
        email: bookingData.attendeeEmail,
        firstname: bookingData.attendeeName,
        product: paymentData.product,
        timestamp: Date.now()
      }))

      // Make payment request
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Payment API error:', errorData)
        throw new Error(errorData.message || 'Payment initiation failed')
      }

      const data = await response.text()
      console.log('PayU form received')
      setPaymentForm(data)
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again."
      })
      onPaymentComplete(false)
      // Clean up stored payment data on error
      localStorage.removeItem('paymentData')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (paymentForm) {
      // Submit the form automatically
      const formData = document.getElementById("payment_post") as HTMLFormElement
      if (formData) {
        formData.submit()
      }
    }
  }, [paymentForm])

  // Clean up payment data when component unmounts
  useEffect(() => {
    return () => {
      const storedData = localStorage.getItem('paymentData')
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          // Only remove if data is older than 1 hour
          if (Date.now() - data.timestamp > 3600000) {
            localStorage.removeItem('paymentData')
          }
        } catch (e) {
          localStorage.removeItem('paymentData')
        }
      }
    }
  }, [])

  return (
    <>
      {/* PayU Form (hidden) */}
      <div
        dangerouslySetInnerHTML={{ __html: paymentForm }}
        style={{ display: 'none' }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Complete your booking by making the payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Event</span>
              <span className="font-medium">{bookingData.eventName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ticket Type</span>
              <span className="font-medium">{bookingData.ticketType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-medium">{bookingData.quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-bold text-primary">${bookingData.amount}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{bookingData.attendeeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{bookingData.attendeeEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="font-medium">{bookingData.attendeePhone}</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processing by PayU
          </p>
        </CardContent>
      </Card>
    </>
  )
}