"use client"

import { Event } from '@/lib/supabase'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

interface BookingSummaryProps {
  event: Event
  bookingData: {
    attendee: any
    payment: any
  }
}

export function BookingSummary({ event, bookingData }: BookingSummaryProps) {
  const ticketPrice = event.price
  const serviceFee = Math.round(ticketPrice * 0.05) // 5% service fee
  const total = ticketPrice + serviceFee

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{event.name}</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>1 ticket</span>
            </div>
          </div>

          <Badge variant="secondary">{event.category}</Badge>
        </div>

        {/* Attendee Info */}
        {bookingData.attendee.name && (
          <div className="space-y-2">
            <h4 className="font-medium">Attendee</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{bookingData.attendee.name}</p>
              <p>{bookingData.attendee.email}</p>
              <p>{bookingData.attendee.phone}</p>
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Pricing</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Ticket Price</span>
              <span>{formatPrice(ticketPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>• Digital tickets will be sent to your email</p>
          <p>• Free cancellation up to 24 hours before the event</p>
          <p>• Please arrive 15 minutes before the event starts</p>
          <p>• Bring a valid ID for entry</p>
        </div>
      </CardContent>
    </Card>
  )
} 