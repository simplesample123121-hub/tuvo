"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Mail, Calendar, MapPin, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { databases, databaseId, collections } from '@/lib/appwrite'
import { ID } from 'appwrite'

interface PaymentSuccessData {
  txnid: string
  amount: string
  status: string
  productinfo: string
  email: string
  firstname: string
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)
  const [error, setError] = useState('')

  const txnid = params.txnid as string

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get payment data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const paymentData: PaymentSuccessData = {
          txnid: txnid,
          amount: urlParams.get('amount') || '',
          status: urlParams.get('status') || 'success',
          productinfo: urlParams.get('productinfo') || '',
          email: urlParams.get('email') || '',
          firstname: urlParams.get('firstname') || ''
        }

        // Parse product info to get event details
        let eventData
        try {
          eventData = JSON.parse(paymentData.productinfo)
        } catch (e) {
          console.error('Failed to parse product info:', e)
          setError('Invalid payment data')
          setLoading(false)
          return
        }

        // Create booking record in database
        const bookingRecord = {
          user_id: user?.$id || '',
          event_id: eventData.eventId || '',
          event_name: eventData.eventName || '',
          ticket_type: eventData.ticketType || 'General',
          quantity: eventData.quantity || 1,
          amount: parseFloat(paymentData.amount) || 0,
          currency: 'USD',
          payment_method: 'PayU',
          payment_status: 'completed',
          transaction_id: paymentData.txnid,
          booking_status: 'confirmed',
          customer_name: paymentData.firstname,
          customer_email: paymentData.email,
          booking_date: new Date().toISOString(),
          event_date: eventData.eventDate || '',
          event_location: eventData.eventLocation || ''
        }

        // Save booking to database
        const createdBooking = await databases.createDocument(
          databaseId,
          collections.bookings,
          ID.unique(),
          bookingRecord
        )

        console.log('✅ Booking created successfully:', createdBooking)
        setBookingData(createdBooking)
        setLoading(false)

      } catch (error) {
        console.error('Error processing payment success:', error)
        setError('Failed to process payment success')
        setLoading(false)
      }
    }

    if (txnid) {
      handlePaymentSuccess()
    }
  }, [txnid, user])

  const handleDownloadTicket = () => {
    // Generate and download ticket PDF
    const ticketData = {
      bookingId: bookingData?.$id,
      eventName: bookingData?.event_name,
      customerName: bookingData?.customer_name,
      eventDate: bookingData?.event_date,
      eventLocation: bookingData?.event_location,
      ticketType: bookingData?.ticket_type,
      quantity: bookingData?.quantity,
      amount: bookingData?.amount
    }

    // Create a simple text-based ticket for now
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

  const handleSendEmail = () => {
    // Send confirmation email
    const emailData = {
      to: bookingData?.customer_email,
      subject: `Booking Confirmation - ${bookingData?.event_name}`,
      body: `Your booking has been confirmed. Booking ID: ${bookingData?.$id}`
    }
    
    // For now, just show an alert
    alert('Confirmation email would be sent to: ' + emailData.to)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
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
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Transaction ID: {txnid}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Event Date</p>
                  <p className="text-sm text-gray-600">{bookingData?.event_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">{bookingData?.event_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-gray-600">{bookingData?.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{bookingData?.customer_email}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ${bookingData?.amount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownloadTicket} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
} 