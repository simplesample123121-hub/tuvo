"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'
import { AuthCheck } from '@/components/auth-check'

// Circle containers data
const circleCategories = [
  {
    id: 'comedy',
    name: 'Comedy',
    image: 'https://cdn2.allevents.in/transup/d3/3a62b5bce449768b0c0c2949e691f4/Comedy-Shows.png',
    color: 'bg-yellow-500'
  },
  {
    id: 'art',
    name: 'Art',
    image: 'https://cdn2.allevents.in/transup/5e/56ec2fe82e4047b228f9b0c61c8819/Buisness.png',
    color: 'bg-pink-500'
  },
  {
    id: 'sports',
    name: 'Sports',
    image: 'https://cdn2.allevents.in/transup/0f/d96086448f4633a1dc083f8db213f6/Concerts.png',
    color: 'bg-green-500'
  },
  {
    id: 'education',
    name: 'Education',
    image: 'https://cdn2.allevents.in/transup/50/f7619ebe624b1f9d841966ec514fee/Parties.png',
    color: 'bg-blue-500'
  },
  {
    id: 'technology',
    name: 'Technology',
    image: 'https://cdn2.allevents.in/transup/cc/8cd4355e904c2db11d8d026fffc3fd/Food-Drinks.png',
    color: 'bg-purple-500'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    image: 'https://cdn2.allevents.in/transup/a4/b0382d9a024fb1b5e7aced9207fe56/Music.png',
    color: 'bg-red-500'
  }
]

// Sample popular events data
const popularEvents = [
  {
    id: 1,
    title: "Hyderabad Tech Summit 2024",
    description: "Join the biggest technology conference in South India featuring top speakers and networking opportunities.",
    date: "2024-03-25",
    time: "09:00",
    location: "HICC, Hitec City, Hyderabad",
    price: "₹2,500",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    rating: 4.9,
    attendees: 1200,
    tags: ["Tech", "Conference", "Networking"]
  },
  {
    id: 2,
    title: "Bollywood Night at Taj",
    description: "Experience the magic of Bollywood with live performances, dance, and music under the stars.",
    date: "2024-03-28",
    time: "19:30",
    location: "Taj Krishna, Banjara Hills",
    price: "₹3,500",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    rating: 4.8,
    attendees: 800,
    tags: ["Bollywood", "Live Music", "Dance"]
  },
  {
    id: 3,
    title: "Hyderabad Food Festival",
    description: "Savor the finest cuisines and wines from top restaurants in Hyderabad.",
    date: "2024-04-02",
    time: "17:00",
    location: "Lumbini Park, Necklace Road",
    price: "₹1,200",
    category: "Food & Drinks",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    rating: 4.7,
    attendees: 2500,
    tags: ["Food", "Wine", "Gourmet"]
  },
  {
    id: 4,
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors and win exciting prizes.",
    date: "2024-04-05",
    time: "14:00",
    location: "T-Hub, IIIT Hyderabad",
    price: "₹800",
    category: "Business",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    rating: 4.6,
    attendees: 300,
    tags: ["Startup", "Pitch", "Investment"]
  },
  {
    id: 5,
    title: "Summer Pool Party",
    description: "Beat the heat with our amazing pool party featuring international DJs and premium cocktails.",
    date: "2024-04-08",
    time: "16:00",
    location: "Novotel, Hitec City",
    price: "₹1,800",
    category: "Parties",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
    rating: 4.5,
    attendees: 400,
    tags: ["Pool Party", "Summer", "DJ"]
  },
  {
    id: 6,
    title: "Hyderabad Marathon 2024",
    description: "Run through the beautiful city of Hyderabad in this annual marathon event with multiple categories.",
    date: "2024-04-12",
    time: "06:00",
    location: "Gachibowli Stadium, Hyderabad",
    price: "₹1,000",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.4,
    attendees: 5000,
    tags: ["Marathon", "Sports", "Fitness"]
  }
]

export function EventDiscovery() {
  const [events, setEvents] = useState(popularEvents)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => {
        const categoryMap: { [key: string]: string } = {
          'music': 'Music',
          'business': 'Business',
          'concert': 'Concert',
          'parties': 'Parties',
          'food-drinks': 'Food & Drinks'
        }
        return event.category === categoryMap[selectedCategory]
      })

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Explore Categories
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Mobile: Horizontal scrollable row */}
          <div className="sm:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
              {circleCategories.map((category) => (
                <button
                  key={category.id}
                  className="flex-shrink-0 flex flex-col items-center space-y-3 p-4"
                >
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden ${category.color}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground text-center">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {circleCategories.map((category) => (
              <button
                key={category.id}
                className="group flex flex-col items-center space-y-3 p-4 hover:bg-muted rounded-lg transition-colors"
              >
                <div className={`relative w-20 h-20 rounded-full overflow-hidden ${category.color}`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground text-center group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Events in Hyderabad Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Popular Events in Hyderabad
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Mobile: Horizontal scrollable row */}
          <div className="sm:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
              {popularEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0 w-64 bg-card border rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/90 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{event.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(event.date)}
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {event.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.attendees.toLocaleString()} attending</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {event.price}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <AuthCheck>
                      <Button asChild className="w-full">
                        <Link href={`/events/${event.id}`}>
                          Book Now
                        </Link>
                      </Button>
                    </AuthCheck>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 