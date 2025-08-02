"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Loader2 } from 'lucide-react'

interface BookingData {
  eventId: string
  eventName: string
  eventDate?: string
  eventLocation?: string
  attendeeName: string
  attendeeEmail: string
  attendeePhone: string
  attendeeGender: string
  attendeeAge: number
  attendeeAddress: string
  ticketType: string
  quantity: number
  amount: number
  bookingId: string
}

interface PayUPaymentFormProps {
  bookingData: BookingData
  onPaymentComplete: (success: boolean, transactionId?: string) => void
}

export function PayUPaymentForm({ bookingData, onPaymentComplete }: PayUPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [paymentForm, setPaymentForm] = useState('')

  const handlePayment = async () => {
    try {
      setLoading(true)

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

      // Store payment data in localStorage for success page
      localStorage.setItem('paymentData', JSON.stringify({
        amount: bookingData.amount,
        productinfo: JSON.stringify(paymentData.product),
        email: bookingData.attendeeEmail,
        firstname: bookingData.attendeeName,
        product: paymentData.product
      }))

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Payment API error:', errorData)
        throw new Error('Payment initiation failed')
      }

      const data = await response.text()
      console.log('PayU response:', data)
      setPaymentForm(data)
    } catch (error) {
      console.error('Payment error:', error)
      onPaymentComplete(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (paymentForm) {
      // Use the same approach as the working implementation
      const formData = document.getElementById("payment_post") as HTMLFormElement
      if (formData) {
        formData.submit()
      }
    }
  }, [paymentForm])

  return (
    <>
      {/* PayU Form (hidden) - matching the working implementation */}
      <div
        dangerouslySetInnerHTML={{ __html: paymentForm }}
        style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px" }}
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
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Event:</span>
                <span>{bookingData.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendee:</span>
                <span>{bookingData.attendeeName}</span>
              </div>
              <div className="flex justify-between">
                <span>Ticket Type:</span>
                <span>{bookingData.ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{bookingData.quantity}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total Amount:</span>
                <span>${bookingData.amount}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-4">
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${bookingData.amount}`
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to PayU's secure payment gateway
            </p>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="font-semibold mb-1">🔒 Secure Payment</p>
            <p>Your payment information is encrypted and secure. We use PayU's trusted payment gateway for all transactions.</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
} 