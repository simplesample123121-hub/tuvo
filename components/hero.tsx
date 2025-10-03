"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowRight, MoreHorizontal, Search, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LocationPicker } from '@/components/location-picker'
import { eventsApi, type Event } from '@/lib/api/events'

const categories = [
  {
    id: 'music',
    name: 'Music',
    image: 'https://cdn2.allevents.in/transup/a4/b0382d9a024fb1b5e7aced9207fe56/Music.png',
    href: '/events?category=music'
  },
  {
    id: 'business',
    name: 'Business',
    image: 'https://cdn2.allevents.in/transup/5e/56ec2fe82e4047b228f9b0c61c8819/Buisness.png',
    href: '/events?category=business'
  },
  {
    id: 'concerts',
    name: 'Concert',
    image: 'https://cdn2.allevents.in/transup/0f/d96086448f4633a1dc083f8db213f6/Concerts.png',
    href: '/events?category=concerts'
  },
  {
    id: 'parties',
    name: 'Parties',
    image: 'https://cdn2.allevents.in/transup/50/f7619ebe624b1f9d841966ec514fee/Parties.png',
    href: '/events?category=parties'
  },
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    image: 'https://cdn2.allevents.in/transup/cc/8cd4355e904c2db11d8d026fffc3fd/Food-Drinks.png',
    href: '/events?category=food-drinks'
  },
  {
    id: 'comedy',
    name: 'Comedy Shows',
    image: 'https://cdn2.allevents.in/transup/d3/3a62b5bce449768b0c0c2949e691f4/Comedy-Shows.png',
    href: '/events?category=comedy'
  }
]

// Category Image Component with Error Handling
function CategoryImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={`${className} bg-primary/10 flex items-center justify-center`}>
        <Calendar className="w-1/2 h-1/2 text-primary" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  )
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    // Load events to populate location list in the picker
    const load = async () => {
      try {
        const data = await eventsApi.getAllPublic()
        setEvents(data)
      } catch {}
    }
    load()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="text-primary">Live.</span> Don't Just Exist.
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover the most happening events around you
              </p>
            </div>

            {/* Combined search with location select button */}
            <div className="w-full max-w-4xl">
              <div className="flex rounded-2xl overflow-hidden shadow-lg border bg-white/90 backdrop-blur-sm">
                <input
                  className="flex-1 px-6 py-4 outline-none bg-transparent text-base placeholder:text-muted-foreground"
                  placeholder="Search events, categories, location..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = (e.target as HTMLInputElement).value
                      window.location.href = `/events?q=${encodeURIComponent(q)}`
                    }
                  }}
                />
                <button type="button" className="px-6 py-4 text-base border-l hover:bg-muted/50 transition-colors" onClick={() => setPickerOpen(true)}>Choose City</button>
                <Link href="/events" className="px-8 py-4 bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors">Search</Link>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Explore Event Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover events by category and find exactly what you're looking for
              </p>
            </div>

            {/* Horizontal Scrolling Container */}
            <div className="relative">
              <div className="cat-items-wrapper flex space-x-4 md:space-x-6 lg:space-x-8 overflow-x-auto pb-6 scrollbar-hide">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="cat-item group flex-shrink-0 flex flex-col items-center p-4 md:p-6 lg:p-8 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 min-w-[120px] md:min-w-[160px] lg:min-w-[200px]"
                  >
                    <div className="relative mb-3 md:mb-4 lg:mb-6">
                      <CategoryImage
                        src={category.image}
                        alt={category.name}
                        className="cat-img w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-lg group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <span className="cat-name text-sm md:text-base lg:text-lg font-medium text-foreground text-center group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </Link>
                ))}

                {/* All Categories Button */}
                <div 
                  className="cat-item group flex-shrink-0 flex flex-col items-center p-4 md:p-6 lg:p-8 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer min-w-[120px] md:min-w-[160px] lg:min-w-[200px]"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="relative mb-3 md:mb-4 lg:mb-6">
                    <div className="cat-img w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MoreHorizontal className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 lg:-top-3 lg:-right-3 bg-primary text-primary-foreground text-xs md:text-sm lg:text-base px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full font-medium">
                      6+
                    </div>
                  </div>
                  <span className="cat-name text-sm md:text-base lg:text-lg font-medium text-foreground text-center group-hover:text-primary transition-colors">
                    All Categories
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70">
                <Link href="/events" className="flex items-center gap-2">
                  View All Events
                  <MoreHorizontal className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <LocationPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={(loc) => router.push(`/events?city=${encodeURIComponent(loc)}`)}
        />
      </section>

      {/* All Categories Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              All Categories
            </DialogTitle>
          </DialogHeader>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Categories Grid */}
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="cat-item group flex flex-col items-center p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div className="relative mb-3">
                    <CategoryImage
                      src={category.image}
                      alt={category.name}
                      className="cat-img w-20 h-20 md:w-24 md:h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <span className="cat-name text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors max-w-[100px]">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 