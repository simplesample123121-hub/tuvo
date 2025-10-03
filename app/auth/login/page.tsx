"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Loader2, Facebook, Mail, ArrowRight, X, Circle } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSending, setMagicSending] = useState(false)
  const [magicSent, setMagicSent] = useState('')

  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, router, redirectUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      router.push(redirectUrl)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSendMagicLink = async () => {
    try {
      setError('')
      setMagicSent('')
      setMagicSending(true)
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/login` }
      })
      if (error) throw error
      setMagicSent('Magic link sent. Please check your email.')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setMagicSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-0">
      <div className="w-full max-w-none rounded-none overflow-hidden bg-card h-[100svh]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left image */}
          <div className="relative hidden md:block h-full">
            <img src="https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?q=80&w=1200&auto=format&fit=crop" alt="Welcome" className="absolute inset-0 h-full w-full object-cover" />
          </div>

          {/* Right panel */}
          <div className="p-6 sm:p-10">
            <div className="mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">Sign In - A new world awaits</h1>
              <p className="text-sm text-muted-foreground mt-2">Join a community of event explorers</p>
            </div>

            

            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  className="h-3 w-3 scale-50 origin-left text-primary focus:ring-primary border-gray-300 rounded"
                  />
                <label htmlFor="remember-me" className="ml-1 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : 'Continue'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Sign up
                  </Link>
                </p>
                {/* <div className="mt-4 space-y-2">
                  {magicSent && (
                    <p className="text-xs text-green-600">{magicSent}</p>
                  )}
                  <Button type="button" variant="outline" className="w-full" onClick={handleSendMagicLink} disabled={magicSending || !formData.email}>
                    {magicSending ? 'Sending magic link...' : 'Send magic link to email'}
                  </Button>
                </div> */}
              </div>
            </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}