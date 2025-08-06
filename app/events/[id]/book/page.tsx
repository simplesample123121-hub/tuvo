"use client"

import { use, useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { eventsApi, Event } from '@/lib/api/events'
import { PayUPaymentForm } from '@/components/payu-payment-form'
import { useAuth } from '@/contexts/AuthContext'

interface BookingPageProps {
  params: Promise<{
    id: string
  }>
}

type BookingStep = 'attendee' | 'payment' | 'confirmation'

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<BookingStep>('attendee')
  const [bookingId, setBookingId] = useState('')
  const [bookingData, setBookingData] = useState({
    attendee: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      age: '',
      address: ''
    },
    payment: null as any
  })

  // Check authentication first
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/events/${id}/book`))
    }
  }, [isAuthenticated, authLoading, router, id])

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        const eventData = await eventsApi.getById(id)
        if (eventData) {
          setEvent(eventData)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Error loading event:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  useEffect(() => {
    // Generate a unique booking ID
    const generateBookingId = () => {
      const timestamp = Date.now().toString()
      const random = Math.random().toString(36).substring(2, 8)
      return `BK${timestamp}${random}`.toUpperCase()
    }
    setBookingId(generateBookingId())
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAttendeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = (paymentData: any) => {
    setBookingData(prev => ({ ...prev, payment: paymentData }))
    setCurrentStep('confirmation')
  }

  const goBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('attendee')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment')
    }
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/events/${event.$id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep === 'attendee' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 'attendee' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    1
                  </div>
                  <span className="ml-2">Attendee Info</span>
                </div>
                <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    2
                  </div>
                  <span className="ml-2">Payment</span>
                </div>
                <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    3
                  </div>
                  <span className="ml-2">Confirmation</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 'attendee' && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Information</CardTitle>
                  <CardDescription>
                    Please provide the attendee details for this booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAttendeeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={bookingData.attendee.name}
                          onChange={(e) => setBookingData(prev => ({
                            ...prev,
                            attendee: { ...prev.attendee, name: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={bookingData.attendee.email}
                          onChange={(e) => setBookingData(prev => ({
                            ...prev,
                            attendee: { ...prev.attendee, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={bookingData.attendee.phone}
                          onChange={(e) => setBookingData(prev => ({
                            ...prev,
                            attendee: { ...prev.attendee, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          value={bookingData.attendee.gender}
                          onChange={(e) => setBookingData(prev => ({
                            ...prev,
                            attendee: { ...prev.attendee, gender: e.target.value }
                          }))}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="1"
                          max="120"
                          value={bookingData.attendee.age}
                          onChange={(e) => setBookingData(prev => ({
                            ...prev,
                            attendee: { ...prev.attendee, age: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <textarea
                        id="address"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                        value={bookingData.attendee.address}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          attendee: { ...prev.attendee, address: e.target.value }
                        }))}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment
                    </CardTitle>
                    <CardDescription>
                      Complete your booking by making the payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PayUPaymentForm
                      bookingData={{
                        eventId: event.$id,
                        eventName: event.name,
                        eventDate: event.date,
                        eventLocation: event.location,
                        attendeeName: bookingData.attendee.name,
                        attendeeEmail: bookingData.attendee.email,
                        attendeePhone: bookingData.attendee.phone,
                        attendeeGender: bookingData.attendee.gender,
                        attendeeAge: parseInt(bookingData.attendee.age),
                        attendeeAddress: bookingData.attendee.address,
                        ticketType: 'Regular',
                        quantity: 1,
                        amount: event.price,
                        bookingId: bookingId
                      }}
                      onPaymentComplete={(success, transactionId) => {
                        if (success) {
                          setCurrentStep('confirmation')
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
                  <CardDescription>
                    Your booking has been successfully confirmed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Booking Details</h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Booking ID: {bookingId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Event:</strong> {event.name}</p>
                    <p><strong>Date:</strong> {formatDate(event.date)}</p>
                    <p><strong>Attendee:</strong> {bookingData.attendee.name}</p>
                    <p><strong>Email:</strong> {bookingData.attendee.email}</p>
                    <p><strong>Amount:</strong> ₹{event.price}</p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={goToDashboard} className="flex-1">
                      Go to Dashboard
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/events">
                        Browse More Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{event.available_tickets} tickets left</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{event.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Ticket Price</span>
                  <span>${event.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${event.price}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                                      <p>• Secure payment processing</p>
                  <p>• Instant confirmation</p>
                  <p>• Digital tickets</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 