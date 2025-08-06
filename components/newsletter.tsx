"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import DarkVeil from './dark-veil'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 2000)
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">Stay Updated</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Never Miss an
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Amazing Event
              </span>
            </h2>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Get early access to exclusive events, special discounts, and insider updates.
              Join our community of event enthusiasts!
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Subscribing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Subscribe Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-xl font-semibold text-white">Successfully Subscribed!</span>
                </div>
                <p className="text-white/80">
                  Thank you for subscribing! You'll receive our latest updates and exclusive offers soon.
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Early Access</h3>
              <p className="text-white/70">Be the first to know about new events and exclusive offers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Weekly Updates</h3>
              <p className="text-white/70">Curated event recommendations delivered to your inbox</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Special Discounts</h3>
              <p className="text-white/70">Exclusive subscriber-only discounts and promotions</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Join 50,000+ event enthusiasts. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 