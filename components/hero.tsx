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
    <section className="relative py-8 lg:py-12 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-3 lg:space-y-4">
          {/* Main Headline */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-snug">
              Discover
              <span className="block text-primary">
                Amazing Events
              </span>
              Near You
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed lg:leading-normal">
              From tech conferences to music festivals, find and book tickets for the most exciting events in your area.
              Secure, fast, and reliable booking platform.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button size="sm" className="px-4 py-2 text-sm lg:size-default lg:px-6 lg:py-2.5 lg:text-base">
              <Link href="/events" className="flex items-center gap-2">
                Browse Events
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 