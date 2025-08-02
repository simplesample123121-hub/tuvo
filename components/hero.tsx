import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-32 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Main Headline */}
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Discover Amazing{' '}
              <span className="text-primary">Events</span>
              <br />
              Near You
            </h1>
            <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              From tech conferences to music festivals, find and book tickets for the most exciting events in your area. 
              Secure, fast, and reliable booking platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/events">
                Browse Events
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cities</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attendees</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
} 