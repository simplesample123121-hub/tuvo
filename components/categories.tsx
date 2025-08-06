"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Search, X, Calendar } from 'lucide-react'

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
  },
  {
    id: 'cooking',
    name: 'Cooking',
    image: 'https://cdn2.allevents.in/transup/88/be50b4952d41578b96f1a1812376c6/Cooking.png',
    href: '/events?category=cooking'
  },
  {
    id: 'crafts',
    name: 'Crafts',
    image: 'https://cdn2.allevents.in/transup/90/638de79b704dc396c68bda5575b787/Crafts.png',
    href: '/events?category=crafts'
  },
  {
    id: 'festivals',
    name: 'Festivals',
    image: 'https://cdn2.allevents.in/transup/54/7a77bab6a74891b5106e950f65768a/Festivals.png',
    href: '/events?category=festivals'
  },
  {
    id: 'fine-arts',
    name: 'Fine Arts',
    image: 'https://cdn2.allevents.in/transup/71/6df6b0856847c9b8f3f53192e58649/Art-Events.png',
    href: '/events?category=fine-arts'
  },
  {
    id: 'dance',
    name: 'Dance',
    image: 'https://cdn2.allevents.in/transup/06/93e11247184966a726a4c915f5053a/Dance.png',
    href: '/events?category=dance'
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    image: 'https://cdn2.allevents.in/transup/c3/0665cdb5cc4cfd8639bc6ae976e773/Health-Wellness.png',
    href: '/events?category=health-wellness'
  },
  {
    id: 'kids',
    name: 'Kids',
    image: 'https://cdn2.allevents.in/transup/53/4f919493bd40c89222408a3f460d07/Kids.png',
    href: '/events?category=kids'
  },
  {
    id: 'performances',
    name: 'Performances',
    image: 'https://cdn2.allevents.in/transup/37/252ba05c974ebc90aab50e279c1a93/Performances.png',
    href: '/events?category=performances'
  },
  {
    id: 'photography',
    name: 'Photography',
    image: 'https://cdn2.allevents.in/transup/bb/7e4055d73d42dcb41f09b918b8a9fa/Photography.png',
    href: '/events?category=photography'
  },
  {
    id: 'sports',
    name: 'Sports',
    image: 'https://cdn2.allevents.in/transup/20/29a06c546b464fab48be462040dcd0/Sports.png',
    href: '/events?category=sports'
  },
  {
    id: 'technology',
    name: 'Technology',
    image: 'https://cdn2.allevents.in/transup/97/4158d7ef284d138a80051f5abcb95f/Technology.png',
    href: '/events?category=technology'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    image: 'https://cdn2.allevents.in/transup/ae/c8c3c371de4cc882e599d75e778d05/Fashion.png',
    href: '/events?category=fashion'
  },
  {
    id: 'theatre',
    name: 'Theatre',
    image: 'https://cdn2.allevents.in/transup/b1/4e93c0bc3e47e59520d9871e342fe7/Theatre.png',
    href: '/events?category=theatre'
  },
  {
    id: 'trips-adventures',
    name: 'Trips & Adventure',
    image: 'https://cdn2.allevents.in/transup/55/23ab4559864f2fb9c4fe6a5017b723/Trips-Adventure.png',
    href: '/events?category=trips-adventures'
  },
  {
    id: 'speed-dating',
    name: 'Speed Dating',
    image: 'https://cdn2.allevents.in/transup/b7/7105cd024144b987d6bd289d6a8864/Dating.png',
    href: '/events?category=speed-dating'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    image: 'https://cdn2.allevents.in/transup/ed/ccc12878dd46a99e3980d7a7135c83/Gaming.png',
    href: '/events?category=gaming'
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

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Event Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover events by category and find exactly what you're looking for
            </p>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="relative">
            <div className="cat-items-wrapper flex space-x-4 md:space-x-6 lg:space-x-8 overflow-x-auto pb-6 scrollbar-hide">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="cat-item group flex-shrink-0 flex flex-col items-center p-4 md:p-6 lg:p-8 bg-card rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 min-w-[120px] md:min-w-[160px] lg:min-w-[200px]"
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
                className="cat-item group flex-shrink-0 flex flex-col items-center p-4 md:p-6 lg:p-8 bg-card rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer min-w-[120px] md:min-w-[160px] lg:min-w-[200px]"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="relative mb-3 md:mb-4 lg:mb-6">
                  <div className="cat-img w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MoreHorizontal className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 lg:-top-3 lg:-right-3 bg-primary text-primary-foreground text-xs md:text-sm lg:text-base px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full font-medium">
                    17+
                  </div>
                </div>
                <span className="cat-name text-sm md:text-base lg:text-lg font-medium text-foreground text-center group-hover:text-primary transition-colors">
                  All Categories
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              <Link href="/events" className="flex items-center gap-2">
                View All Events
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
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
                  className="cat-item group flex flex-col items-center p-4 bg-card rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
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