"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Crown, Loader2, User } from 'lucide-react'

export function BhanuAdminLogin() {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBhanuLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await login('bhanu30oct@gmail.com', 'Cyber@123')
      
      if (result.success) {
        router.push('/admin')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to login as Bhanu admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Bhanu Admin Access</CardTitle>
        <CardDescription>
          Quick login for Bhanu admin user
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
            <span className="font-mono">bhanu30oct@gmail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono">Cyber@123</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-semibold text-green-600">Admin</span>
          </div>
        </div>

        <Button 
          onClick={handleBhanuLogin} 
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
              Login as Bhanu Admin
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