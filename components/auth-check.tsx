"use client"

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showAuthModal?: boolean
}

export function AuthCheck({ children, fallback, showAuthModal = true }: AuthCheckProps) {
  const { isAuthenticated, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If authenticated, show the children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // If not authenticated and showAuthModal is true, show the auth modal
  if (showAuthModal) {
    const redirectUrl = encodeURIComponent(pathname)
    
    return (
      <>
        <div onClick={() => setShowModal(true)}>
          {fallback || children}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Login Required
              </DialogTitle>
              <DialogDescription className="text-center">
                Please login or create an account to book tickets for this event.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-6">
              <Button asChild className="w-full" size="lg">
                <Link href={`/auth/login?redirect=${redirectUrl}`} onClick={() => setShowModal(false)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href={`/auth/register?redirect=${redirectUrl}`} onClick={() => setShowModal(false)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Don't have an account? Sign up to get started with booking events.
            </p>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // If not authenticated and showAuthModal is false, redirect to login
  return (
    <div onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}>
      {fallback || children}
    </div>
  )
}

// Hook for programmatic auth checks
export function useAuthCheck() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const requireAuth = (callback?: () => void) => {
    if (loading) return false
    
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      return false
    }
    
    if (callback) callback()
    return true
  }

  return { requireAuth, isAuthenticated, loading }
} 