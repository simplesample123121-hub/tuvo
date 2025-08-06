"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, User, Settings, LogOut, Calendar } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

// Custom Logo Component
const TuvoLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
        <Calendar className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl text-foreground">Tuvo</span>
    </div>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Mock authentication state - replace with your actual auth logic
  const isAuthenticated = false

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* NavbarBrand - Left Side */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <TuvoLogo />
              </Link>
            </div>

            {/* NavbarContent - Center Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <nav className="flex items-center space-x-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                        isActive 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* NavbarContent - Right Side Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons - Show when not authenticated */}
              {!isAuthenticated && (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link 
                    href="/auth/login" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  >
                    Login
                  </Link>
                  <Button asChild size="sm" className="px-4">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* User Menu - Show when authenticated */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/user.png" alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          U
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">User Name</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          user@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-background border-b">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Auth Buttons - Show when not authenticated */}
              {!isAuthenticated && (
                <div className="pt-4 border-t space-y-2">
                  <Link 
                    href="/auth/login"
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  )
} 