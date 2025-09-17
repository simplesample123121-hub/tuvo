"use client"

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { eventsApi, type Event } from '@/lib/api/events'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function OrganizerPage() {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/organizer')
      return
    }
    const load = async () => {
      const all = await eventsApi.getAll()
      const mine = all.filter(e => e.created_by === user?.$id)
      setEvents(mine)
      setLoading(false)
    }
    load()
  }, [isAuthenticated, router, user?.$id])

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Organized Events</h1>
        <Button asChild><Link href="/events/create">Request New Event</Link></Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <Card key={ev.$id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{ev.name}</span>
                  <div className="flex gap-2">
                    {ev.approval_status && <Badge variant={ev.approval_status === 'approved' ? 'default' : ev.approval_status === 'pending' ? 'secondary' : 'destructive'}>{ev.approval_status}</Badge>}
                    <Badge variant={ev.status === 'upcoming' ? 'default' : ev.status === 'ongoing' ? 'secondary' : 'outline'}>{ev.status}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button asChild variant="outline"><Link href={`/organizer/${ev.$id}`}>Manage</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


