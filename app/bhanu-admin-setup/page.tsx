"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Key, User, Shield, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'

export default function BhanuAdminSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bhanu Admin Setup
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Set up admin access for Bhanu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bhanu Admin Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Bhanu Admin User
              </CardTitle>
              <CardDescription>
                Use these credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">bhanu30oct@gmail.com</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Password:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">Cyber@123</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Role:</span>
                  <Badge variant="secondary">Admin</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <Key className="mr-2 h-4 w-4" />
                    Login as Bhanu Admin
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Features
              </CardTitle>
              <CardDescription>
                What Bhanu can do with admin access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Create and manage events</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">View and manage all bookings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Manage user accounts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">View analytics and reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Configure system settings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Manage payment settings</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Admin Panel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              🔧 Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <p><strong>Option 1: Automatic Setup</strong></p>
              <p>• Run the script: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">node utils/add-bhanu-admin.js</code></p>
              <p>• Replace project ID in the script first</p>
              
              <p className="mt-4"><strong>Option 2: Manual Setup</strong></p>
              <p>• Go to Appwrite Console → Authentication → Users</p>
              <p>• Create user: bhanu30oct@gmail.com / Cyber@123</p>
              <p>• Go to Databases → eventbooker_db → users</p>
              <p>• Create profile with role: "admin"</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  Quick Login
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin-setup">
                  Default Admin Setup
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 mt-8">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              ⚠️ Important Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>• <strong>Change the default password</strong> immediately after first login</p>
              <p>• <strong>Keep credentials secure</strong> and don't share them</p>
              <p>• <strong>Monitor admin activities</strong> regularly</p>
              <p>• <strong>Use strong passwords</strong> for production</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  Login Now
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 