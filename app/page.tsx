import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { EventDiscovery } from '@/components/event-discovery'
import { Features } from '@/components/features'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { MobileDebug } from '@/components/mobile-debug'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading EventHub...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<LoadingFallback />}>
            <EventDiscovery />
          </Suspense>
          <Suspense fallback={<div className="py-24 bg-gray-50 dark:bg-gray-900"><div className="container px-4 mx-auto text-center">Loading features...</div></div>}>
            <Features />
          </Suspense>
          <Suspense fallback={<div className="py-24 bg-white dark:bg-gray-900"><div className="container px-4 mx-auto text-center">Loading testimonials...</div></div>}>
            <Testimonials />
          </Suspense>
        </main>
        <Footer />
        <MobileDebug />
      </div>
    </ErrorBoundary>
  )
} 