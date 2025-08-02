"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Crown, Loader2 } from 'lucide-react'

export function AdminLogin() {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdminLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await login('admin@eventbooker.com', 'Admin@123')
      
      if (result.success) {
        router.push('/admin')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to login as admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
          <Crown className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Admin Access</CardTitle>
        <CardDescription>
          Quick login with default admin credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono">admin@eventbooker.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono">Admin@123</span>
          </div>
        </div>

        <Button 
          onClick={handleAdminLogin} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <Crown className="mr-2 h-4 w-4" />
              Login as Admin
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>⚠️ Change default password after first login</p>
        </div>
      </CardContent>
    </Card>
  )
} 