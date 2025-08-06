"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Discover
              <span className="block text-primary">
                Amazing Events
              </span>
              Near You
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From tech conferences to music festivals, find and book tickets for the most exciting events in your area.
              Secure, fast, and reliable booking platform.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Link href="/events" className="flex items-center gap-2">
                Browse Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 