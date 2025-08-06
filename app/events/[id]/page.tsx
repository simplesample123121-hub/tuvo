"use client"

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Users, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { eventsApi, Event } from '@/lib/api/events'
import { AuthCheck } from '@/components/auth-check'

interface EventDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

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

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative">
              <img
                src={event.image_url || '/images/event-placeholder.jpg'}
                alt={event.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary">
                  {event.category}
                </Badge>
                {event.featured && (
                  <Badge variant="default" className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
                <CardDescription className="text-lg">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{formatTime(event.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-sm text-muted-foreground">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Available Tickets</p>
                      <p className="text-sm text-muted-foreground">{event.available_tickets} left</p>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Location</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    {(() => {
                      try {
                        const locationData = JSON.parse(event.location);
                        return (
                          <>
                            <p className="font-medium">{locationData.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {locationData.city}, {locationData.state} {locationData.country}
                            </p>
                          </>
                        );
                      } catch (error) {
                        return <p className="font-medium">{event.venue}</p>;
                      }
                    })()}
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book Tickets</CardTitle>
                <CardDescription>
                  Secure your spot at this amazing event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">${event.price}</span>
                  <span className="text-sm text-muted-foreground">per ticket</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Available Tickets</span>
                    <span className="font-medium">{event.available_tickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tickets</span>
                    <span className="font-medium">{event.ticket_count}</span>
                  </div>
                </div>

                <AuthCheck>
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/events/${event.$id}/book`}>
                      Book Now
                    </Link>
                  </Button>
                </AuthCheck>

                <p className="text-xs text-muted-foreground text-center">
                                      Secure payment processing
                </p>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Category</span>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Featured</span>
                  <span>{event.featured ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created By</span>
                  <span>{event.created_by}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 