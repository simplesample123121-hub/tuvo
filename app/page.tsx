import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { EventDiscovery } from '@/components/event-discovery'
import { Features } from '@/components/features'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        <EventDiscovery />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
} 