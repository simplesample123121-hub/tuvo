"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, Star, IndianRupee } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Event } from '@/lib/api/events'
import Image from 'next/image'
import { AuthCheck } from '@/components/auth-check'

interface EventCardProps {
  event: Event
  showActions?: boolean
}

export default function EventCard({ event, showActions = true }: EventCardProps) {
  if (!event) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="text-[10px] tracking-wide">
            {event.category}
          </Badge>
          {event.featured && (
            <Badge variant="default" className="text-[10px] bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-5">
        <CardTitle className="text-base font-semibold mb-1 line-clamp-1">{event.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm col-span-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className="w-4 h-4" />
            <span>{event.available_tickets} left</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <IndianRupee className="w-4 h-4" />
            <span>{formatPrice(event.price || 0, 'INR')}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'} className="capitalize">
              {event.status}
            </Badge>
            {event.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>
          {showActions && (
            <AuthCheck>
              <Button asChild size="sm" className="rounded-full px-4">
                <Link href={`/events/${event.$id || ''}`}>View</Link>
              </Button>
            </AuthCheck>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 