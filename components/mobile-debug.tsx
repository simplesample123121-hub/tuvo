"use client"

import { useEffect, useState } from 'react'

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
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Mobile Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={() => setIsVisible(false)}
        className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
      >
        Close
      </button>
    </div>
  )
} 