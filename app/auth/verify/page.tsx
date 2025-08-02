"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { account } from '@/lib/appwrite'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const userId = searchParams.get('userId')
        const secret = searchParams.get('secret')

        if (!userId || !secret) {
          setError('Invalid verification link')
          setLoading(false)
          return
        }

        // Update user verification status
        await account.updateVerification(userId, secret)
        setSuccess(true)
      } catch (error: any) {
        console.error('Verification error:', error)
        setError(error.message || 'Verification failed')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleLogin = () => {
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Email Verification
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
            <CardDescription>
              {success ? 'Your email has been verified' : 'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your email has been successfully verified! You can now log in to your account.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <Button onClick={handleLogin} className="w-full">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 