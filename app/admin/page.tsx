"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { eventsApi } from '@/lib/api/events'
import { bookingsApi } from '@/lib/api/bookings'
import { formatPrice } from '@/lib/utils'
import { 
  Calendar, 
  Users, 
  IndianRupee, 
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    completedEvents: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [events, allBookings] = await Promise.all([
          eventsApi.getAll(),
          bookingsApi.getAll(),
        ])

        const totalEvents = events.length
        const upcomingEvents = events.filter(e => e.status === 'upcoming').length
        const ongoingEvents = events.filter(e => e.status === 'ongoing').length
        const completedEvents = events.filter(e => e.status === 'completed').length
        const activeEvents = upcomingEvents + ongoingEvents
        const totalBookings = allBookings.length
        const totalRevenue = allBookings
          .filter(b => b.payment_status === 'completed')
          .reduce((sum, b) => sum + (b.amount || 0), 0)

        const recent = allBookings
          .slice(0, 10)
          .map(b => ({
            id: b.$id,
            eventName: b.event_name,
            attendee: b.customer_name,
            amount: b.amount,
            status: b.booking_status,
            date: new Date(b.booking_date).toLocaleDateString(),
          }))

        setMetrics({ totalEvents, totalBookings, totalRevenue, activeEvents, upcomingEvents, ongoingEvents, completedEvents })
        setRecentBookings(recent)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your event platform.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Events</CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalEvents}</div>
            {/* <p className="text-xs text-gray-500">
              +12% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Bookings</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalBookings}</div>
            {/* <p className="text-xs text-gray-500">
              +8% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.totalRevenue, 'INR')}</div>
            {/* <p className="text-xs text-muted-foreground">
              +15% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeEvents}</div>
            {/* <p className="text-xs text-muted-foreground">
              Currently running
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Event Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.upcomingEvents}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Events scheduled for the future
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Ongoing Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.ongoingEvents}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Events currently happening
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{metrics.completedEvents}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Events that have finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="font-medium">{booking.eventName}</p>
                    <p className="text-sm text-muted-foreground">{booking.attendee}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(booking.amount)}</p>
                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <Calendar className="h-6 w-6 mb-2" />
                <p className="font-medium">Create Event</p>
                <p className="text-sm text-muted-foreground">Add a new event</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <Users className="h-6 w-6 mb-2" />
                <p className="font-medium">View Bookings</p>
                <p className="text-sm text-muted-foreground">Manage bookings</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <BarChart3 className="h-6 w-6 mb-2" />
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">View reports</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <Settings className="h-6 w-6 mb-2" />
                <p className="font-medium">Settings</p>
                <p className="text-sm text-muted-foreground">Configure platform</p>
              </button>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusRows />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 

function StatusRows() {
  const [status, setStatus] = useState<any>({})
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' })
        const data = await res.json()
        setStatus(data)
      } catch {
        setStatus({ platform: 'error', database: 'error', payment: 'error', email: 'not_configured' })
      }
    }
    load()
  }, [])

  const Dot = ({ ok }: { ok: boolean }) => (
    <div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Platform Status</span>
        <div className="flex items-center gap-2">
          <Dot ok={true} />
          <span className="text-sm text-green-600">Operational</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Database</span>
        <div className="flex items-center gap-2">
          <Dot ok={status.database === 'ok'} />
          <span className="text-sm">{status.database === 'ok' ? 'Connected' : 'Error'}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Payment Processing</span>
        <div className="flex items-center gap-2">
          <Dot ok={status.payment === 'ok'} />
          <span className="text-sm">{status.payment === 'ok' ? 'Online' : 'Error'}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Email Service</span>
        <div className="flex items-center gap-2">
          <Dot ok={status.email === 'configured'} />
          <span className="text-sm">{status.email === 'configured' ? 'Configured' : 'Not Configured'}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">Last check: {status.timestamp || '-'}</div>
    </div>
  )
}