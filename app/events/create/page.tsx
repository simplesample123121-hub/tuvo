"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EVENT_CATEGORIES } from '@/lib/categories'
import { eventsApi } from '@/lib/api/events'
import { toast } from '@/hooks/use-toast'

export default function CreateEventRequestPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    price: '0',
    ticket_count: '100',
    image_url: '',
    location: JSON.stringify({ address: '', city: '', state: '', country: '' }),
    tags: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/events/create')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.$id) return
    setSubmitting(true)
    try {
      const created = await eventsApi.create({
        name: form.name,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        category: form.category,
        price: parseFloat(form.price || '0'),
        ticket_count: parseInt(form.ticket_count || '0'),
        available_tickets: parseInt(form.ticket_count || '0'),
        status: 'upcoming',
        image_url: form.image_url,
        created_by: user.$id,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: false,
        location: form.location,
        approval_status: 'pending',
        submission_source: 'user'
      })
      if (created) {
        toast({
          title: 'Request submitted',
          description: 'Your event request was sent to admins for approval. We\'ll notify you once reviewed.'
        })
        router.push(`/organizer`)
      }
    } catch (e) {
      toast({ title: 'Failed to submit', description: 'Please try again later.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request to Create an Event</CardTitle>
          <CardDescription>Submit details for admin approval before publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="price">Ticket Price</Label>
              <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ticket_count">Total Tickets</Label>
              <Input id="ticket_count" type="number" min="1" value={form.ticket_count} onChange={e => setForm({ ...form, ticket_count: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="music, festival" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit for Approval'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


