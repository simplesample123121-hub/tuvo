"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await forgotPassword(email)
      if (res.success) {
        setSuccess(res.message)
        toast({ title: 'Check your email', description: 'We sent a reset link to your inbox.' })
        setTimeout(() => router.push('/auth/login'), 1500)
      } else {
        setError(res.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#f5f6f8'}}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email address. If an account exists, you'll receive instructions for resetting your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email address"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.push('/auth/login')}
              >
                Back to Login
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


