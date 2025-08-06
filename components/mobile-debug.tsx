"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

export function MobileDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show debug info on mobile and in development
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsVisible(true)
      
      const info = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        location: window.location.href,
        timestamp: new Date().toISOString(),
        cookies: document.cookie ? 'Present' : 'None',
        localStorage: typeof localStorage !== 'undefined' ? 'Available' : 'Not available',
        sessionStorage: typeof sessionStorage !== 'undefined' ? 'Available' : 'Not available',
        onLine: navigator.onLine,
        connection: (navigator as any).connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt
        } : 'Not available'
      }
      
      setDebugInfo(info)
      
      // Log to console for debugging
      console.log('Mobile Debug Info:', info)
      
      // Send to analytics or logging service if needed
      if (process.env.NODE_ENV === 'production') {
        // You can send this to your analytics service
        console.log('Production mobile debug:', info)
      }
    }
  }, [])

  if (!isVisible || process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 max-w-xs z-50 bg-slate-900 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white">Mobile Debug</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 text-white hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <pre className="whitespace-pre-wrap overflow-auto text-xs text-white/80">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
} 