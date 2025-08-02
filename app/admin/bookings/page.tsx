"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import { bookingsApi, Booking } from '@/lib/api/bookings'
import { eventsApi, Event } from '@/lib/api/events'
import { useAuth } from '@/contexts/AuthContext'

// Sample bookings data
const sampleBookings: Booking[] = [
  {
    $id: '1',
    event_id: '1',
    attendee_name: 'John Doe',
    attendee_email: 'john.doe@example.com',
    attendee_phone: '+1-555-0123',
    attendee_gender: 'male',
    attendee_age: 28,
    attendee_address: '123 Main St, New York, NY 10001',
    payment_status: 'completed',
    payment_amount: 299,
    payment_method: 'payu',
    qr_code: 'QR123456789',
    status: 'confirmed',
    ticket_type: 'regular',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    $id: '2',
    event_id: '2',
    attendee_name: 'Jane Smith',
    attendee_email: 'jane.smith@example.com',
    attendee_phone: '+1-555-0456',
    attendee_gender: 'female',
    attendee_age: 32,
    attendee_address: '456 Oak Ave, Los Angeles, CA 90210',
    payment_status: 'completed',
    payment_amount: 199,
    payment_method: 'payu',
    qr_code: 'QR987654321',
    status: 'confirmed',
    ticket_type: 'regular',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z'
  },
  {
    $id: '3',
    event_id: '3',
    attendee_name: 'Mike Johnson',
    attendee_email: 'mike.johnson@example.com',
    attendee_phone: '+1-555-0789',
    attendee_gender: 'male',
    attendee_age: 25,
    attendee_address: '789 Pine St, Chicago, IL 60601',
    payment_status: 'pending',
    payment_amount: 149,
    payment_method: 'payu',
    qr_code: 'QR456789123',
    status: 'pending',
    ticket_type: 'regular',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    $id: '4',
    event_id: '4',
    attendee_name: 'Sarah Wilson',
    attendee_email: 'sarah.wilson@example.com',
    attendee_phone: '+1-555-0321',
    attendee_gender: 'female',
    attendee_age: 29,
    attendee_address: '321 Elm St, Miami, FL 33101',
    payment_status: 'completed',
    payment_amount: 75,
    payment_method: 'payu',
    qr_code: 'QR789123456',
    status: 'confirmed',
    ticket_type: 'regular',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  }
]

// Sample events for reference
const sampleEvents = [
  { id: '1', name: 'Tech Conference 2024' },
  { id: '2', name: 'Summer Music Festival' },
  { id: '3', name: 'Food & Wine Expo' },
  { id: '4', name: 'Art Gallery Opening' }
]

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Load data from Appwrite
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [bookingsData, eventsData] = await Promise.all([
          bookingsApi.getAll(),
          eventsApi.getAll()
        ])
        setBookings(bookingsData)
        setEvents(eventsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.attendee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.attendee_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.qr_code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || booking.payment_status === selectedPaymentStatus
    const matchesEvent = selectedEvent === 'all' || booking.event_id === selectedEvent
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesEvent
  })

    const getEventName = (eventId: string) => {    
    const event = events.find(e => e.$id === eventId)
    return event?.name || 'Unknown Event'
  }

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const updatedBooking = await bookingsApi.update(bookingId, { status: newStatus })
      if (updatedBooking) {
        setBookings(bookings.map(booking => 
          booking.$id === bookingId ? updatedBooking : booking
        ))
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handlePaymentStatusChange = async (bookingId: string, newPaymentStatus: 'pending' | 'completed' | 'failed') => {
    try {
      const updatedBooking = await bookingsApi.update(bookingId, { payment_status: newPaymentStatus })
      if (updatedBooking) {
        setBookings(bookings.map(booking => 
          booking.$id === bookingId ? updatedBooking : booking
        ))
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        const success = await bookingsApi.delete(bookingId)
        if (success) {
          setBookings(bookings.filter(booking => booking.$id !== bookingId))
        }
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = bookings
    .filter(booking => booking.payment_status === 'completed')
    .reduce((sum, booking) => sum + booking.payment_amount, 0)

  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">
            Manage and track all event bookings
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Pending bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {sampleEvents.map(event => (
                  <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.$id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{booking.attendee_name}</p>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{getEventName(booking.event_id)}</p>
                    <p className="text-sm text-muted-foreground">{booking.attendee_email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(booking.payment_amount)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(booking.created_at || '')}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetailsModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteBooking(booking.$id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attendee Information */}
              <div>
                <h3 className="font-semibold mb-3">Attendee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedBooking.attendee_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedBooking.attendee_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedBooking.attendee_phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Age</Label>
                    <p className="font-medium">{selectedBooking.attendee_age} years</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Gender</Label>
                    <p className="font-medium capitalize">{selectedBooking.attendee_gender}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedBooking.attendee_address}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="font-semibold mb-3">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Event</Label>
                    <p className="font-medium">{getEventName(selectedBooking.event_id)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Booking ID</Label>
                    <p className="font-medium">{selectedBooking.$id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">QR Code</Label>
                    <p className="font-medium font-mono">{selectedBooking.qr_code}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Created</Label>
                    <p className="font-medium">{formatDate(selectedBooking.created_at || '')}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Amount</Label>
                    <p className="font-medium text-lg">{formatPrice(selectedBooking.payment_amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Payment Status</Label>
                    <Badge className={getPaymentStatusColor(selectedBooking.payment_status)}>
                      {selectedBooking.payment_status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Booking Status</Label>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 