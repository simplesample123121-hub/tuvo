"use client"

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DarkVeil from './dark-veil'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Organizer",
    company: "Tech Events Inc.",
    content: "Tuvo has completely transformed how we organize events. The platform is intuitive, the support is amazing, and our attendees love the seamless booking experience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    company: "Startup Hub",
    content: "The analytics and insights we get from Tuvo are incredible. It's helped us understand our audience better and improve our event planning significantly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Community Manager",
    company: "Creative Collective",
    content: "As someone who manages multiple events monthly, Tuvo has been a game-changer. The automation features save us hours of work every week.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Conference Director",
    company: "Innovation Summit",
    content: "The platform's reliability and ease of use have made our annual conference planning so much smoother. Highly recommended for any event organizer.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Event Coordinator",
    company: "Music Festival Co.",
    content: "Tuvo's mobile-first approach and real-time updates have revolutionized how we handle large-scale events. Our attendees love the convenience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dark Veil Background */}
      <DarkVeil 
        hueShift={0}
        noiseIntensity={0.01}
        scanlineIntensity={0.05}
        speed={0.2}
        scanlineFrequency={0.3}
        warpAmount={0.05}
        resolutionScale={1}
      />

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-white/80">Trusted by 10,000+ organizers</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what event organizers and attendees have to say about Tuvo.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Testimonials Container */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <Quote className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <blockquote className="text-center mb-8">
                      <p className="text-lg lg:text-xl text-white/90 leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white/20 shadow-lg"
                      />
                      <div className="text-center">
                        <div className="font-semibold text-white text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-white/70">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-white/70">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/70">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/70">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
} 