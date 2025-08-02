"use client"

import { useState, useMemo } from 'react'
import EventCard from '@/components/event-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sampleEvents, categories } from '@/lib/sample-data'
import { isEventOngoing, isEventUpcoming } from '@/lib/utils'
import { Search, Filter } from 'lucide-react'

export function EventDiscovery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('upcoming')

  // Filter and categorize events
  const filteredEvents = useMemo(() => {
    let filtered = sampleEvents.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Categorize events by status
    const ongoing = filtered.filter(event => isEventOngoing(event.date, event.time))
    const upcoming = filtered.filter(event => isEventUpcoming(event.date, event.time))

    return { ongoing, upcoming }
  }, [searchQuery, selectedCategory])

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Amazing Events
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Find the perfect event for you. From technology conferences to music festivals, 
            we have something for everyone.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events, venues, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        </div>

        {/* Event Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {filteredEvents.upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.upcoming.map((event) => (
                  <EventCard key={event.$id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming events found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-6">
            {filteredEvents.ongoing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.ongoing.map((event) => (
                  <EventCard key={event.$id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No ongoing events found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View All Events CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <a 
            href="/events" 
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            View all events →
          </a>
        </div>
      </div>
    </section>
  )
} 