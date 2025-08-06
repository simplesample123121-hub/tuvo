"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/admin')
    } else if (!loading && user && !isAdmin) {
      router.push('/dashboard?error=unauthorized')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white/80">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
} 