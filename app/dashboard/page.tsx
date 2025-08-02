"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { bookingsApi } from '@/lib/api/bookings'
import { eventsApi } from '@/lib/api/events'
import { 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Ticket, 
  MapPin, 
  Clock,
  DollarSign,
  Eye,
  Download,
  Edit,
  Trash2
} from 'lucide-react'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'

interface UserBooking {
  $id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  attendee_name: string;
  payment_status: string;
  payment_amount: number;
  status: string;
  created_at?: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0,
    completedBookings: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    loadUserData()
  }, [isAuthenticated, router])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user's bookings
      const userBookings = await bookingsApi.getByUser(user?.$id || '')
      
      // Get event details for each booking
      const bookingsWithEvents = await Promise.all(
        userBookings.map(async (booking) => {
          const event = await eventsApi.getById(booking.event_id)
          return {
            ...booking,
            event_name: event?.name || 'Unknown Event',
            event_date: event?.date || '',
            event_time: event?.time || '',
            event_venue: event?.venue || ''
          }
        })
      )

      setBookings(bookingsWithEvents)

      // Calculate stats
      const totalBookings = bookingsWithEvents.length
      const upcomingBookings = bookingsWithEvents.filter(b => 
        new Date(b.event_date) > new Date() && b.status === 'confirmed'
      ).length
      const totalSpent = bookingsWithEvents
        .filter(b => b.payment_status === 'completed')
        .reduce((sum, b) => sum + b.payment_amount, 0)
      const completedBookings = bookingsWithEvents.filter(b => 
        new Date(b.event_date) < new Date()
      ).length

      setStats({
        totalBookings,
        upcomingBookings,
        totalSpent,
        completedBookings
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.text}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your bookings and profile
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Events you're attending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                On event tickets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">
                Past events attended
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your event bookings and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start exploring events and make your first booking!
                    </p>
                    <Button onClick={() => router.push('/events')}>
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.$id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{booking.event_name}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(booking.event_date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTime(booking.event_time)}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.event_venue}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentStatusBadge(booking.payment_status)}
                              <span className="text-sm font-medium">
                                {formatPrice(booking.payment_amount)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Ticket
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <p className="text-gray-900 dark:text-white">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="text-gray-900 dark:text-white">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                      <Badge className="mt-1">
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <Badge className={`mt-1 ${
                        user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => router.push('/profile/edit')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 