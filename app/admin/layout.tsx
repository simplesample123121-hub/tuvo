"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import AdminGuard from '@/components/AdminGuard'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Shield
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Bookings', href: '/admin/bookings', icon: Users },
  { name: 'Users', href: '/admin/users', icon: User },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isSuperAdmin } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">A</span>
                  </div>
                  <span className="font-bold text-xl">Admin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  {isSuperAdmin && (
                    <Shield className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6">
            <div className="flex h-16 items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-xl">Admin</span>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li className="mt-auto">
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      {isSuperAdmin && (
                        <Shield className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
} 