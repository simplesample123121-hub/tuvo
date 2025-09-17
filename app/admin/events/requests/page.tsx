"use client"

import { useEffect, useState } from 'react'
import { eventsApi, type Event } from '@/lib/api/events'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

export default function AdminEventRequestsPage() {
  const { isAdmin, user } = useAuth()
  const [pending, setPending] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [reasonById, setReasonById] = useState<Record<string, string>>({})

  const load = async () => {
    try {
      setLoading(true)
      const all = await eventsApi.getAll()
      // Only show pending requests created from user surface
      setPending(all.filter(e => e.approval_status === 'pending' && e.submission_source !== 'admin'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (!isAdmin) {
    return <div className="container px-4 mx-auto py-8">Admins only</div>
  }

  const handleApprove = async (id: string) => {
    if (!user?.$id) return
    const ok = await eventsApi.approve(id, user.$id)
    if (ok) {
      toast({ title: 'Approved', description: 'Event approved and now public.' })
      load()
    }
  }
  const handleReject = async (id: string) => {
    if (!user?.$id) return
    const reason = reasonById[id] || 'Not suitable'
    const ok = await eventsApi.reject(id, user.$id, reason)
    if (ok) {
      toast({ title: 'Rejected', description: 'Event request rejected.' })
      load()
    }
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Event Requests</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.map(ev => (
            <Card key={ev.$id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{ev.name}</span>
                  <Badge>Pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Category: {ev.category}</div>
                <div className="text-sm text-muted-foreground">Venue: {ev.venue}</div>
                <div className="text-sm text-muted-foreground">Requested by: {ev.created_by}</div>
                <div>
                  <Label htmlFor={`reason-${ev.$id}`}>Rejection reason (optional)</Label>
                  <Textarea id={`reason-${ev.$id}`} value={reasonById[ev.$id] || ''} onChange={e => setReasonById({ ...reasonById, [ev.$id]: e.target.value })} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => handleReject(ev.$id)}>Reject</Button>
                  <Button onClick={() => handleApprove(ev.$id)}>Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


