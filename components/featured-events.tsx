"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { eventsApi, type Event } from '@/lib/api/events'
import EventCard from '@/components/event-card'

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await eventsApi.getFeatured()
        const valid = data.filter(e => e && e.$id)
        setEvents(valid)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/50 backdrop-blur-sm mb-6">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Featured Events</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Trending Events</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the most popular and exciting events happening around you.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Loading featured…</div>
        ) : events.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No featured events yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(ev => (
              <EventCard key={ev.$id} event={ev} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-xl px-8 py-3 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70">
            <Link href="/events" className="text-lg">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}