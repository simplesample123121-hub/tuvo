"use client"

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EVENT_CATEGORIES } from '@/lib/categories'
import EventCard from '@/components/event-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { eventsApi, Event } from '@/lib/api/events'
import { LocationPicker } from '@/components/location-picker'

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900"><div className="container px-4 py-12 mx-auto">Loading events...</div></div>}>
      <EventsContent />
    </Suspense>
  )
}

function EventsContent() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [locationQuery, setLocationQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await eventsApi.getAllPublic()
        // Filter out any events that don't have a valid $id
        const validEvents = data.filter(event => event && event.$id)
        setEvents(validEvents)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Apply category/location from URL query (e.g., /events?category=music&location=mumbai)
  useEffect(() => {
    const categoryFromUrl = searchParams?.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
    const locationFromUrl = searchParams?.get('location')
    if (locationFromUrl) {
      setLocationQuery(locationFromUrl)
    }
  }, [searchParams])

  const normalize = (value: string | undefined) => (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const name = event.name || ''
      const description = event.description || ''
      const venue = event.venue || ''
      const locationText = (() => {
        const loc = event.location || ''
        try {
          const parsed = JSON.parse(loc)
          const city = parsed?.city || ''
          const address = parsed?.address || ''
          return `${city} ${address}`.trim()
        } catch {
          return loc
        }
      })()
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           venue.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = !locationQuery.trim() ||
        venue.toLowerCase().includes(locationQuery.toLowerCase()) ||
        locationText.toLowerCase().includes(locationQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' 
        || normalize(event.category) === normalize(selectedCategory)
      
      return matchesSearch && matchesCategory && matchesLocation
    })

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        default:
          return 0
      }
    })

    return filtered
  }, [events, searchQuery, selectedCategory, sortBy])

  const categories = EVENT_CATEGORIES.map(c => c.name)
  const popularLocations = useMemo(() => {
    const set = new Set<string>()
    for (const ev of events) {
      const venue = (ev.venue || '').trim()
      if (venue) set.add(venue)
      try {
        const parsed = JSON.parse(ev.location || '{}')
        if (parsed?.city) set.add(String(parsed.city))
      } catch {}
      if (set.size >= 12) break
    }
    return Array.from(set).slice(0, 12)
  }, [events])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Events</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Discover amazing events happening near you. Filter by category, search by name, or browse all available events.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events, venues, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by city or location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setPickerOpen(true)}>Choose City</Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick locations */}
        {popularLocations.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {popularLocations.map(loc => (
              <Button key={loc} size="sm" variant="outline" onClick={() => setLocationQuery(loc)}>
                {loc}
              </Button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground dark:text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-gray-400">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredEvents.map((event) => (
              <EventCard key={event.$id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
                         <p className="text-muted-foreground dark:text-gray-400 mb-4">No events found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      <LocationPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        allLocations={events.map(ev => {
          const list: string[] = []
          if (ev.venue) list.push(ev.venue)
          try {
            const parsed = JSON.parse(ev.location || '{}')
            if (parsed?.city) list.push(String(parsed.city))
            if (parsed?.address) list.push(String(parsed.address))
          } catch {}
          return list.join('|')
        }).flatMap(s => s.split('|').filter(Boolean))}
        onSelect={(loc) => setLocationQuery(loc)}
      />
    </div>
  )
} 