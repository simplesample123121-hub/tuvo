"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Trash2, Search, Filter, Calendar, MapPin, Users, IndianRupee } from 'lucide-react'
import { EVENT_CATEGORIES } from '@/lib/categories'
import { formatPrice } from '@/lib/utils'
import { eventsApi, Event } from '@/lib/api/events'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    price: '',
    ticket_count: '',
    available_tickets: '',
    status: 'upcoming',
    image_url: '',
    tags: '',
    featured: false,
    location: JSON.stringify({
      address: '',
      city: '',
      state: '',
      country: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    })
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventsApi.getAll()
      // Filter out any events that don't have a valid $id
      const validEvents = data.filter(event => event && event.$id)
      setEvents(validEvents)
    } catch (error) {
      console.error('Error loading events:', error)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      setImageUploading(true)
      let imageUrl = formData.image_url
      if (imageFile) {
        const filePath = `events/${Date.now()}-${imageFile.name}`
        const { error: upErr } = await supabase.storage.from('event-images').upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type || 'image/jpeg'
        })
        if (upErr) {
          console.error('Image upload error:', upErr)
        } else {
          const { data: pub } = supabase.storage.from('event-images').getPublicUrl(filePath)
          if (pub?.publicUrl) imageUrl = pub.publicUrl
        }
      }

      const newEvent = await eventsApi.create({
        ...formData,
        price: parseFloat(formData.price),
        ticket_count: parseInt(formData.ticket_count),
        available_tickets: parseInt(formData.available_tickets),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        created_by: 'admin',
        status: formData.status as 'upcoming' | 'ongoing' | 'completed',
        location: formData.location,
        image_url: imageUrl
      })

      if (newEvent) {
        setEvents([...events, newEvent])
        setShowCreateDialog(false)
        resetForm()
      }
      setImageUploading(false)
    } catch (error) {
      console.error('Error creating event:', error)
      setError('Failed to create event')
      setImageUploading(false)
    }
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    try {
      setError('')
      setImageUploading(true)
      let imageUrl = formData.image_url
      if (imageFile) {
        // If the existing image URL points to our bucket and has same filename, skip re-upload
        const currentUrl = formData.image_url || ''
        const currentName = (() => {
          try {
            const u = new URL(currentUrl)
            const parts = u.pathname.split('/')
            const last = parts[parts.length - 1]
            return decodeURIComponent(last || '')
          } catch {
            return ''
          }
        })()
        if (currentUrl.includes('/storage/v1/object/public/event-images/') && currentName === imageFile.name) {
          // keep existing imageUrl
        } else {
        const filePath = `events/${Date.now()}-${imageFile.name}`
        const { error: upErr } = await supabase.storage.from('event-images').upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type || 'image/jpeg'
        })
        if (upErr) {
          console.error('Image upload error:', upErr)
        } else {
          const { data: pub } = supabase.storage.from('event-images').getPublicUrl(filePath)
          if (pub?.publicUrl) imageUrl = pub.publicUrl
        }
        }
      }

      const updatedEvent = await eventsApi.update(editingEvent.$id, {
        ...formData,
        price: parseFloat(formData.price),
        ticket_count: parseInt(formData.ticket_count),
        available_tickets: parseInt(formData.available_tickets),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: formData.status as 'upcoming' | 'ongoing' | 'completed',
        location: formData.location,
        image_url: imageUrl
      })

      if (updatedEvent) {
        setEvents(events.map(event => 
          event.$id === editingEvent.$id ? updatedEvent : event
        ))
        setEditingEvent(null)
        resetForm()
      }
      setImageUploading(false)
    } catch (error) {
      console.error('Error updating event:', error)
      setError('Failed to update event')
      setImageUploading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const success = await eventsApi.delete(eventId)
      if (success) {
        setEvents(events.filter(event => event.$id !== eventId))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event')
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      price: event.price.toString(),
      ticket_count: event.ticket_count.toString(),
      available_tickets: event.available_tickets.toString(),
      status: event.status,
      image_url: event.image_url,
      tags: event.tags.join(', '),
      featured: event.featured,
      location: JSON.stringify(event.location)
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: '',
      price: '',
      ticket_count: '',
      available_tickets: '',
      status: 'upcoming',
      image_url: '',
      tags: '',
      featured: false,
      location: JSON.stringify({
        address: '',
        city: '',
        state: '',
        country: '',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      })
    })
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || event.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || !statusFilter || event.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Create and manage events</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new event
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ticket_count">Total Tickets *</Label>
                  <Input
                    id="ticket_count"
                    type="number"
                    min="1"
                    required
                    value={formData.ticket_count}
                    onChange={(e) => setFormData({ ...formData, ticket_count: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="available_tickets">Available Tickets *</Label>
                  <Input
                    id="available_tickets"
                    type="number"
                    min="0"
                    required
                    value={formData.available_tickets}
                    onChange={(e) => setFormData({ ...formData, available_tickets: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image_file">Or Upload Image</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-1">Selected: {imageFile.name}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="technology, conference, innovation"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured Event</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {EVENT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setStatusFilter('all'); }}>
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.$id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {event.image_url && (
                <div className="relative w-full h-40">
                  <Image
                    src={event.image_url}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription>{event.category}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.$id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(event.date)} at {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {event.available_tickets} tickets left
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  {formatPrice(event.price || 0, 'INR')}
                </div>
                <div className="flex space-x-2">
                  <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}>
                    {event.status}
                  </Badge>
                  {event.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Event Name *</Label>
                <Input
                  id="edit-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-venue">Venue *</Label>
                <Input
                  id="edit-venue"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-ticket-count">Total Tickets *</Label>
                <Input
                  id="edit-ticket-count"
                  type="number"
                  min="1"
                  required
                  value={formData.ticket_count}
                  onChange={(e) => setFormData({ ...formData, ticket_count: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-available-tickets">Available Tickets *</Label>
                <Input
                  id="edit-available-tickets"
                  type="number"
                  min="0"
                  required
                  value={formData.available_tickets}
                  onChange={(e) => setFormData({ ...formData, available_tickets: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-image-url">Image URL</Label>
              <Input
                id="edit-image-url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="technology, conference, innovation"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <Label htmlFor="edit-featured">Featured Event</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 