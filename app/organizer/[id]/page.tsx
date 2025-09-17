"use client"

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { eventsApi, type Event } from '@/lib/api/events'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EVENT_CATEGORIES } from '@/lib/categories'
import { useToast } from '@/hooks/use-toast'

export default function OrganizerManageEventPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user, isAdmin } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    price: '',
    ticket_count: '',
    available_tickets: '',
    image_url: '',
    description: '',
    tags: ''
  })

  const eventId = useMemo(() => {
    const idParam = params?.id
    if (!idParam) return ''
    if (Array.isArray(idParam)) return idParam[0]
    return idParam
  }, [params])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/organizer/${eventId}`)
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await eventsApi.getById(eventId)
        setEvent(data)
        if (data) {
          setForm({
            name: data.name || '',
            category: data.category || '',
            date: data.date || '',
            time: data.time || '',
            venue: data.venue || '',
            price: (data.price ?? 0).toString(),
            ticket_count: (data.ticket_count ?? 0).toString(),
            available_tickets: (data.available_tickets ?? 0).toString(),
            image_url: data.image_url || '',
            description: data.description || '',
            tags: (data.tags || []).join(', ')
          })
        }
      } catch (e) {
        setError('Failed to load event')
      } finally {
        setLoading(false)
      }
    }
    if (eventId) load()
  }, [isAuthenticated, router, eventId])

  const canManage = useMemo(() => {
    if (!event || !user) return false
    return isAdmin || event.created_by === user.$id || (event.created_by || '').toLowerCase() === (user.$id || '').toLowerCase()
  }, [event, user, isAdmin])

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-8">Loading...</div>
    )
  }

  if (error || !event) {
    return (
      <div className="container px-4 mx-auto py-8">
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Event not found</CardTitle></CardHeader>
          <CardContent>
            <Button asChild variant="outline"><Link href="/organizer">Back to My Events</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="container px-4 mx-auto py-8">
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Not authorized</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">You do not have permission to manage this event.</p>
            <Button asChild variant="outline"><Link href="/organizer">Back to My Events</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    try {
      setSaving(true)
      const updated = await eventsApi.update(event.$id, {
        name: form.name,
        category: form.category,
        date: form.date,
        time: form.time,
        venue: form.venue,
        price: parseFloat(form.price || '0'),
        ticket_count: parseInt(form.ticket_count || '0'),
        available_tickets: parseInt(form.available_tickets || '0'),
        image_url: form.image_url,
        description: form.description,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      })
      if (updated) {
        setEvent(updated)
        toast({ title: 'Saved', description: 'Event details updated.' })
      }
    } catch {
      toast({ title: 'Failed to save', description: 'Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Manage: {event.name}</h1>
          <div className="flex gap-2 mt-2">
            {event.approval_status && (
              <Badge variant={event.approval_status === 'approved' ? 'default' : event.approval_status === 'pending' ? 'secondary' : 'destructive'}>
                {event.approval_status}
              </Badge>
            )}
            <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}>
              {event.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/organizer">Back</Link></Button>
          <Button variant="outline" disabled={!isAdmin && event.approval_status === 'approved'}>
            {(!isAdmin && event.approval_status === 'approved') ? 'Editing locked' : 'Edit'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Category: {event.category}</div>
                <div className="text-sm text-muted-foreground">Venue: {event.venue}</div>
                <div className="text-sm text-muted-foreground">Date/Time: {event.date} {event.time}</div>
                <div className="text-sm text-muted-foreground">Tickets: {event.available_tickets}/{event.ticket_count}</div>
                <div className="text-sm text-muted-foreground">Price: {event.price}</div>
                <div className="text-sm">{event.description}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" disabled>View Sales (coming soon)</Button>
                <Button className="w-full" variant="outline" disabled>Manage Tickets (coming soon)</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
            </CardHeader>
            <CardContent>
              {(!isAdmin && event.approval_status === 'approved') ? (
                <div className="text-sm text-muted-foreground">This event is approved. Contact support or an admin to request changes.</div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_CATEGORIES.map(c => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Input id="venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_count">Total Tickets</Label>
                      <Input id="ticket_count" type="number" min="0" value={form.ticket_count} onChange={e => setForm({ ...form, ticket_count: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="available_tickets">Available Tickets</Label>
                      <Input id="available_tickets" type="number" min="0" value={form.available_tickets} onChange={e => setForm({ ...form, available_tickets: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input id="image_url" type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader><CardTitle>Tickets</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Ticket management coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader><CardTitle>Sales</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Sales analytics coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


