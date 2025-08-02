"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, Star, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Event } from '@/lib/api/events'
import Image from 'next/image'

interface EventCardProps {
  event: Event
  showActions?: boolean
}

export default function EventCard({ event, showActions = true }: EventCardProps) {
  if (!event) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {event.category} #{parseInt(event.$id?.slice(-1)) || 1}
            </Badge>
            {event.featured && (
              <Badge variant="default" className="text-xs bg-yellow-500 text-white">
                Featured
              </Badge>
            )}
          </div>
        </div>
      )}
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
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
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>${event.price}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}>
              {event.status}
            </Badge>
            {event.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href={`/events/${event.$id || ''}`}>
                  View Details
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 