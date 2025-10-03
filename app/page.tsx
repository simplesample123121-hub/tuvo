"use client"
import { Suspense, useState } from 'react'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { MobileDebug } from '@/components/mobile-debug'
import { Button } from '@/components/ui/button'
import { HomeEventTabs } from '@/components/home-event-tabs'
import { FeaturedEvents } from '@/components/featured-events'

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
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; provider?: string; messageId?: string; previewUrl?: string; error?: string } | null>(null)

  const handleTestResendMail = async () => {
    try {
      setSending(true)
      setResult(null)
      const to = prompt('Enter recipient email for test:') || ''
      if (!to) {
        setResult({ ok: false, error: 'No recipient provided' })
        return
      }
      // Use direct Resend SDK route per official docs
      const res = await fetch('/api/resend-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to })
      })
      const data = await res.json()
      if (!res.ok || data?.ok === false) {
        setResult({ ok: false, error: data?.error || 'Failed to send' })
      } else {
        setResult({ ok: true, provider: 'resend', messageId: data.id })
      }
    } catch (e: any) {
      setResult({ ok: false, error: e.message || 'Failed to send' })
    } finally {
      setSending(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <main>
          <Hero />
          <Suspense fallback={<div className="py-16"><div className="text-center text-muted-foreground">Loading featured…</div></div>}>
            <FeaturedEvents />
          </Suspense>
          <Suspense fallback={<div className="py-16"><div className="text-center text-muted-foreground">Loading events…</div></div>}>
            <HomeEventTabs />
          </Suspense>
          <Suspense fallback={<div className="py-24"><div className="container mx-auto text-center">Loading features...</div></div>}>
            <Features />
          </Suspense>
        </main>
        <Footer />
        <MobileDebug />
      </div>
    </ErrorBoundary>
  )
}