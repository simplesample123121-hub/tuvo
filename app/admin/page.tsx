"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleEvents } from '@/lib/sample-data'
import { formatPrice } from '@/lib/utils'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react'

// Sample data for dashboard
const dashboardData = {
  totalEvents: sampleEvents.length,
  totalBookings: 1247,
  totalRevenue: 156789,
  activeEvents: sampleEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length,
  upcomingEvents: sampleEvents.filter(e => e.status === 'upcoming').length,
  ongoingEvents: sampleEvents.filter(e => e.status === 'ongoing').length,
  completedEvents: sampleEvents.filter(e => e.status === 'completed').length,
}

const recentBookings = [
  {
    id: '1',
    eventName: 'Tech Conference 2024',
    attendee: 'John Doe',
    amount: 299,
    status: 'confirmed',
    date: '2024-01-15'
  },
  {
    id: '2',
    eventName: 'Summer Music Festival',
    attendee: 'Jane Smith',
    amount: 199,
    status: 'confirmed',
    date: '2024-01-14'
  },
  {
    id: '3',
    eventName: 'Food & Wine Expo',
    attendee: 'Mike Johnson',
    amount: 149,
    status: 'pending',
    date: '2024-01-13'
  },
  {
    id: '4',
    eventName: 'Art Gallery Opening',
    attendee: 'Sarah Wilson',
    amount: 75,
    status: 'confirmed',
    date: '2024-01-12'
  }
]

export default function AdminDashboard() {
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
            <div className="text-3xl font-bold text-gray-900">{dashboardData.totalEvents}</div>
            <p className="text-xs text-gray-500">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Bookings</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.totalBookings}</div>
            <p className="text-xs text-gray-500">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(dashboardData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeEvents}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
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
            <div className="text-3xl font-bold text-blue-600">{dashboardData.upcomingEvents}</div>
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
            <div className="text-3xl font-bold text-green-600">{dashboardData.ongoingEvents}</div>
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
            <div className="text-3xl font-bold text-gray-600">{dashboardData.completedEvents}</div>
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
        <Card>
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Platform Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Processing</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 