"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, Star, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import DarkVeil from './dark-veil'
import { AuthCheck } from '@/components/auth-check'

const featuredEvents = [
  {
    id: 1,
    title: "Hyderabad Tech Summit 2024",
    description: "Join the biggest technology conference featuring industry leaders and cutting-edge innovations.",
    date: "2024-03-25",
    time: "09:00",
    location: "HICC, Hitec City",
    price: "₹2,500",
    originalPrice: "₹3,500",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    rating: 4.9,
    attendees: 1200,
    tags: ["Tech", "Conference", "Networking"],
    featured: true,
    discount: "28% OFF"
  },
  {
    id: 2,
    title: "Bollywood Night at Taj",
    description: "Experience the magic of Bollywood with live performances and dance under the stars.",
    date: "2024-03-28",
    time: "19:30",
    location: "Taj Krishna, Banjara Hills",
    price: "₹3,500",
    originalPrice: "₹4,500",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    rating: 4.8,
    attendees: 800,
    tags: ["Bollywood", "Live Music", "Dance"],
    featured: true,
    discount: "22% OFF"
  },
  {
    id: 3,
    title: "Hyderabad Food Festival",
    description: "Savor the best of Hyderabadi cuisine with over 50 restaurants showcasing their signature dishes.",
    date: "2024-04-02",
    time: "17:00",
    location: "Lumbini Park, Necklace Road",
    price: "₹1,200",
    originalPrice: "₹1,800",
    category: "Food & Drinks",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    rating: 4.7,
    attendees: 2500,
    tags: ["Food", "Festival", "Local Cuisine"],
    featured: true,
    discount: "33% OFF"
  },
  {
    id: 4,
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors and win exciting prizes.",
    date: "2024-04-05",
    time: "14:00",
    location: "T-Hub, IIIT Hyderabad",
    price: "₹800",
    originalPrice: "₹1,200",
    category: "Business",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    rating: 4.6,
    attendees: 300,
    tags: ["Startup", "Pitch", "Investment"],
    featured: false,
    discount: "33% OFF"
  },
  {
    id: 5,
    title: "Summer Pool Party",
    description: "Beat the heat with our amazing pool party featuring international DJs and premium cocktails.",
    date: "2024-04-08",
    time: "16:00",
    location: "Novotel, Hitec City",
    price: "₹1,800",
    originalPrice: "₹2,200",
    category: "Parties",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop",
    rating: 4.5,
    attendees: 400,
    tags: ["Pool Party", "Summer", "DJ"],
    featured: false,
    discount: "18% OFF"
  },
  {
    id: 6,
    title: "Hyderabad Marathon 2024",
    description: "Run through the beautiful city of Hyderabad in this annual marathon event with multiple categories.",
    date: "2024-04-12",
    time: "06:00",
    location: "Gachibowli Stadium",
    price: "₹1,000",
    originalPrice: "₹1,500",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    rating: 4.4,
    attendees: 5000,
    tags: ["Marathon", "Sports", "Fitness"],
    featured: false,
    discount: "33% OFF"
  }
]

export function FeaturedEvents() {
  const [likedEvents, setLikedEvents] = useState<number[]>([])

  const toggleLike = (eventId: number) => {
    setLikedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dark Veil Background */}
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.015}
        scanlineIntensity={0.08}
        speed={0.25}
        scanlineFrequency={0.4}
        warpAmount={0.08}
        resolutionScale={1}
      />

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-white/80">Featured Events</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trending Events
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover the most popular and exciting events happening in Hyderabad.
            Book your tickets before they sell out!
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/10 backdrop-blur-sm border border-white/20">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Top Actions */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-white/90 text-slate-900 font-semibold">
                    {event.category}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLike(event.id)}
                      className="w-8 h-8 bg-white/90 hover:bg-white text-slate-900 rounded-full"
                    >
                      <Heart
                        className={`w-4 h-4 ${likedEvents.includes(event.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 bg-white/90 hover:bg-white text-slate-900 rounded-full"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Discount Badge */}
                {event.discount && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {event.discount}
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold text-slate-900">{event.rating}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6">
                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} at {event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.toLocaleString()} attending</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      {event.price}
                    </span>
                    {event.originalPrice && (
                      <span className="text-sm text-white/50 line-through">
                        {event.originalPrice}
                      </span>
                    )}
                  </div>

                  <AuthCheck>
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg">
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl px-8 py-3">
            <Link href="/events" className="text-lg">
              View All Events
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 