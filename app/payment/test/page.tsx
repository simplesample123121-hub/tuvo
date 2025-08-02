"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentTestPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate storing payment data
    const testPaymentData = {
      amount: 299,
      productinfo: JSON.stringify({
        eventId: 'test-event-1',
        eventName: 'Test Event 2024',
        eventDate: '2024-12-25T10:00:00Z',
        eventLocation: 'Test Venue, Test City',
        ticketType: 'Regular',
        quantity: 1,
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        attendeePhone: '1234567890',
        attendeeGender: 'Male',
        attendeeAge: 25,
        attendeeAddress: 'Test Address'
      }),
      email: 'test@example.com',
      firstname: 'Test User',
      product: {
        eventId: 'test-event-1',
        eventName: 'Test Event 2024',
        eventDate: '2024-12-25T10:00:00Z',
        eventLocation: 'Test Venue, Test City',
        ticketType: 'Regular',
        quantity: 1,
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        attendeePhone: '1234567890',
        attendeeGender: 'Male',
        attendeeAge: 25,
        attendeeAddress: 'Test Address'
      }
    }

    localStorage.setItem('paymentData', JSON.stringify(testPaymentData))
    
    // Redirect to payment success page
    router.push('/payment/success/PAYU_MONEY_TEST_123')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up test payment data...</p>
        <p className="mt-2 text-sm text-gray-500">Redirecting to success page...</p>
      </div>
    </div>
  )
} 