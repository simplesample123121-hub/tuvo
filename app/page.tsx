"use client"
import { Suspense, useState } from 'react'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { MobileDebug } from '@/components/mobile-debug'
import { Button } from '@/components/ui/button'

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
          {/* <div className="container px-4 mx-auto my-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Button onClick={handleTestResendMail} disabled={sending}>
                {sending ? 'Sending test…' : 'Test Resend Mail'}
              </Button>
              {result && (
                <div className={`text-sm px-3 py-2 rounded border ${result.ok ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {result.ok ? (
                    <>
                      Sent via {result.provider || 'unknown'} (ID: {result.messageId || 'n/a'})
                      {result.previewUrl && (
                        <>
                          {' • '}
                          <a className="underline" href={result.previewUrl} target="_blank" rel="noreferrer">Preview</a>
                        </>
                      )}
                    </>
                  ) : (
                    <>Failed: {result.error || 'Unknown error'}</>
                  )}
                </div>
              )}
            </div>
          </div> */}
          <Suspense fallback={<LoadingFallback />}>
            <Categories />
          </Suspense>
          <Suspense fallback={<div className="py-24 bg-background"><div className="container px-4 mx-auto text-center">Loading features...</div></div>}>
            <Features />
          </Suspense>
        </main>
        <Footer />
        <MobileDebug />
      </div>
    </ErrorBoundary>
  )
}