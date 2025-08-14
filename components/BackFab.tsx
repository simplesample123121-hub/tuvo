"use client"

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackFab() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = useCallback(() => {
    // Try to go back; if there's no history or we land on the same route, fallback
    try {
      router.back()
      // As a safety net, also push to a sensible default shortly after
      setTimeout(() => {
        // Fallbacks based on area of the app
        if (pathname?.startsWith('/admin')) {
          router.push('/admin')
        } else if (pathname?.startsWith('/dashboard')) {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      }, 300)
    } catch {
      if (pathname?.startsWith('/admin')) {
        router.push('/admin')
      } else if (pathname?.startsWith('/dashboard')) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    }
  }, [router, pathname])

  return (
    <div className="md:hidden fixed bottom-4 left-4 z-50">
      <Button onClick={handleBack} size="sm" variant="secondary" className="shadow-lg">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  )
}


