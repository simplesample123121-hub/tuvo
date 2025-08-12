"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { bookingsApi } from '@/lib/api/bookings'
import { eventsApi } from '@/lib/api/events'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Ticket, 
  MapPin, 
  Clock,
  IndianRupee,
  Eye,
  Download,
  Edit,
  Trash2,
  Search
} from 'lucide-react'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import Image from 'next/image'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface UserBooking {
  $id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  event_location: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  booking_status: 'confirmed' | 'cancelled' | 'pending';
  customer_name: string;
  customer_email: string;
  booking_date: string;
  created_at?: string;
  updated_at?: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [eventsById, setEventsById] = useState<Record<string, any>>({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')
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
    if (!user?.$id) return

    loadUserData()

    // Realtime removed per your preference; data will refresh on page load
    return () => {}
  }, [isAuthenticated, user?.$id, user?.email, router])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load user's bookings
      const userBookings = await bookingsApi.getByUser(user?.$id || '', user?.email)
      
      // Fetch events to enrich with images and latest details
      const events = await eventsApi.getAll()
      const map: Record<string, any> = {}
      for (const ev of events) map[ev.$id] = ev
      setEventsById(map)

      const bookingsWithEvents = userBookings

      setBookings(bookingsWithEvents)

      // Calculate stats
      const totalBookings = bookingsWithEvents.length
      const upcomingBookings = bookingsWithEvents.filter(b => 
        new Date(b.event_date) > new Date() && b.booking_status === 'confirmed'
      ).length
      const totalSpent = bookingsWithEvents
        .filter(b => b.payment_status === 'completed')
        .reduce((sum, b) => sum + b.amount, 0)
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
      setError('Failed to load your bookings. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTicket = async (booking: UserBooking) => {
    const ev = eventsById[booking.event_id]
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    // Background
    doc.setFillColor(246, 248, 252)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F')

    // Gradient header substitute using bands
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFillColor(24, 119, 242)
    doc.rect(0, 0, pageWidth, 70, 'F')
    doc.setFillColor(35, 138, 255)
    doc.rect(0, 70, pageWidth, 10, 'F')

    // Header text
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text('TUVO TICKET', 40, 45)

    // Main ticket container with a detachable stub on the right
    const marginX = 40
    const top = 110
    const ticketWidth = pageWidth - marginX * 2
    const ticketHeight = 420
    const stubWidth = 150

    // Body
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(marginX, top, ticketWidth, ticketHeight, 12, 12, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(marginX, top, ticketWidth, ticketHeight, 12, 12, 'S')

    // Perforation line for stub
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(1)
    // Dotted line
    // @ts-ignore - setLineDash exists in jspdf typings in recent versions
    doc.setLineDash([3, 3], 0)
    doc.line(marginX + ticketWidth - stubWidth, top + 10, marginX + ticketWidth - stubWidth, top + ticketHeight - 10)
    // Reset line dash
    // @ts-ignore
    doc.setLineDash([])

    // Event image banner
    let currentY = top + 20
    const innerLeft = marginX + 20
    const innerRight = marginX + ticketWidth - stubWidth - 20
    const innerWidth = innerRight - innerLeft
    const imageHeight = 140
    if (ev?.image_url) {
      try {
        const imgData = await fetch(ev.image_url).then(r => r.blob()).then(blob => new Promise<string>((resolve) => {
          const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(blob);
        }))
        doc.addImage(imgData, 'JPEG', innerLeft, currentY, innerWidth, imageHeight, undefined, 'SLOW')
      } catch {}
    } else {
      // placeholder banner
      doc.setFillColor(248, 250, 252)
      doc.rect(innerLeft, currentY, innerWidth, imageHeight, 'F')
      doc.setTextColor(148, 163, 184)
      doc.setFontSize(12)
      doc.text('Event image', innerLeft + 10, currentY + 24)
    }
    currentY += imageHeight + 22

    // Event title
    doc.setTextColor(17, 24, 39)
    doc.setFontSize(22)
    const title = booking.event_name || 'Event'
    const titleLines = doc.splitTextToSize(title, innerWidth)
    doc.text(titleLines as unknown as string[], innerLeft, currentY)
    currentY += 26 + (Array.isArray(titleLines) ? (titleLines.length - 1) * 14 : 0)

    // Info grid left
    doc.setFontSize(12)
    doc.setTextColor(71, 85, 105)
    const infoLeftX = innerLeft
    const infoRightX = innerLeft + innerWidth / 2
    const lineGap = 18
    const drawInfo = (label: string, value: string, x: number, y: number) => {
      doc.setTextColor(100, 116, 139)
      doc.text(label, x, y)
      doc.setTextColor(31, 41, 55)
      doc.text(value, x, y + 14)
    }
    drawInfo('Date', `${formatDate(booking.event_date)}`, infoLeftX, currentY)
    drawInfo('Location', booking.event_location || 'TBD', infoRightX, currentY)
    currentY += lineGap + 14
    drawInfo('Attendee', booking.customer_name || 'Guest', infoLeftX, currentY)
    drawInfo('Email', booking.customer_email || '-', infoRightX, currentY)
    currentY += lineGap + 14
    drawInfo('Ticket', `${booking.ticket_type} • Qty ${booking.quantity}`, infoLeftX, currentY)
    drawInfo('Amount', `${formatPrice(booking.amount, 'INR')}`, infoRightX, currentY)

    // Meta and QR
    currentY += lineGap + 20
    doc.setDrawColor(226, 232, 240)
    doc.line(innerLeft, currentY, innerRight, currentY)
    currentY += 20
    doc.setTextColor(71, 85, 105)
    doc.text(`Booking ID: ${booking.$id}`, innerLeft, currentY)
    currentY += 16
    doc.text(`Transaction ID: ${booking.transaction_id}`, innerLeft, currentY)

    // QR on stub
    const qrPayload = JSON.stringify({ id: booking.$id, txn: booking.transaction_id })
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 120, margin: 1 })
    const stubX = marginX + ticketWidth - stubWidth + 15
    const stubY = top + 40
    doc.addImage(qrDataUrl, 'PNG', stubX, stubY, 120, 120)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('Scan to verify', stubX + 18, stubY + 134)

    // Stub labels vertical
    doc.setFontSize(12)
    doc.setTextColor(31, 41, 55)
    doc.text('ADMIT ONE', stubX + 26, top + ticketHeight - 40)

    // Footer note
    doc.setFontSize(10)
    doc.setTextColor(148, 163, 184)
    doc.text('Please carry a valid ID. Non-transferable. For support: support@tuvo.com', marginX, top + ticketHeight + 36)

    doc.save(`ticket-${booking.$id}.pdf`)
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
            <Button onClick={() => router.push('/events')}>
              <Search className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => router.push('/admin')}>
                Admin Console
              </Button>
            )}
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
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
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
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search by event, venue, or ticket type..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                    <SelectTrigger className="w-full md:w-[220px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={loadUserData}>Refresh</Button>
                </div>

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
                    {bookings
                      .filter(b => {
                        const q = search.toLowerCase()
                        const matchesSearch = b.event_name.toLowerCase().includes(q)
                          || b.event_location.toLowerCase().includes(q)
                          || b.ticket_type.toLowerCase().includes(q)
                        const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter
                        return matchesSearch && matchesStatus
                      })
                      .map((booking) => {
                        const ev = eventsById[booking.event_id]
                        return (
                          <div key={booking.$id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex gap-4">
                              {ev?.image_url ? (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                                  <Image src={ev.image_url} alt={booking.event_name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-24 h-24 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                                  <Ticket className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{booking.event_name}</h3>
                                    <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formatDate(booking.event_date)}
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {booking.event_location}
                                      </div>
                                      <div className="flex items-center">
                                        <Ticket className="h-4 w-4 mr-1" />
                                        {booking.ticket_type}
                                      </div>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 mt-2">
                                      {getStatusBadge(booking.booking_status)}
                                      {getPaymentStatusBadge(booking.payment_status)}
                                      <span className="text-sm font-medium">
                                        {formatPrice(booking.amount, 'INR')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownloadTicket(booking)}>
                                      <Download className="h-4 w-4 mr-1" />
                                      Ticket
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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