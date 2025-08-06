import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Tuvo...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<LoadingFallback />}>
            <Categories />
          </Suspense>
          <Suspense fallback={<div className="py-24 bg-background"><div className="container px-4 mx-auto text-center">Loading features...</div></div>}>
            <Features />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
} 