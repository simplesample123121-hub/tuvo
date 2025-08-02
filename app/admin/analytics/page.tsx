"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Eye,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { sampleEvents } from '@/lib/sample-data'

// Sample analytics data
const analyticsData = {
  totalRevenue: 156789,
  totalBookings: 1247,
  totalEvents: 8,
  averageTicketPrice: 187,
  conversionRate: 12.5,
  monthlyGrowth: 8.2,
  topPerformingEvents: [
    { name: 'Tech Conference 2024', revenue: 44850, bookings: 150, conversion: 15.2 },
    { name: 'Summer Music Festival', revenue: 39800, bookings: 200, conversion: 13.8 },
    { name: 'Food & Wine Expo', revenue: 11175, bookings: 75, conversion: 11.4 },
    { name: 'Art Gallery Opening', revenue: 5625, bookings: 75, conversion: 9.8 }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 14200 },
    { month: 'Apr', revenue: 18900 },
    { month: 'May', revenue: 22100 },
    { month: 'Jun', revenue: 25600 },
    { month: 'Jul', revenue: 23400 },
    { month: 'Aug', revenue: 19800 },
    { month: 'Sep', revenue: 21500 },
    { month: 'Oct', revenue: 24100 },
    { month: 'Nov', revenue: 26800 },
    { month: 'Dec', revenue: 28900 }
  ],
  categoryPerformance: [
    { category: 'Technology', revenue: 44850, bookings: 150, percentage: 28.6 },
    { category: 'Music', revenue: 39800, bookings: 200, percentage: 25.4 },
    { category: 'Food & Drink', revenue: 11175, bookings: 75, percentage: 7.1 },
    { category: 'Art', revenue: 5625, bookings: 75, percentage: 3.6 },
    { category: 'Sports', revenue: 28900, bookings: 145, percentage: 18.4 },
    { category: 'Business', revenue: 15600, bookings: 104, percentage: 9.9 },
    { category: 'Education', revenue: 10839, bookings: 98, percentage: 6.9 }
  ],
  recentActivity: [
    { type: 'booking', message: 'New booking for Tech Conference 2024', time: '2 minutes ago', amount: 299 },
    { type: 'payment', message: 'Payment completed for Summer Music Festival', time: '5 minutes ago', amount: 199 },
    { type: 'event', message: 'New event created: Business Summit 2024', time: '1 hour ago' },
    { type: 'booking', message: 'Booking cancelled for Food & Wine Expo', time: '2 hours ago', amount: -149 },
    { type: 'payment', message: 'Payment failed for Art Gallery Opening', time: '3 hours ago', amount: 75 }
  ]
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Users className="h-4 w-4 text-blue-600" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'event': return <Calendar className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track performance and insights for your event platform
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analyticsData.totalRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(analyticsData.monthlyGrowth)}
              <span className={getGrowthColor(analyticsData.monthlyGrowth)}>
                +{analyticsData.monthlyGrowth}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(5.2)}
              <span className="text-green-600">+5.2%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(2.1)}
              <span className="text-green-600">+2.1%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Ticket Price</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analyticsData.averageTicketPrice)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getGrowthIcon(-1.5)}
              <span className="text-red-600">-1.5%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {analyticsData.monthlyRevenue.map((item, index) => (
                <div key={item.month} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-primary rounded-t-sm transition-all hover:bg-primary/80"
                    style={{ 
                      height: `${(item.revenue / Math.max(...analyticsData.monthlyRevenue.map(r => r.revenue))) * 200}px`
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Revenue trend over the last 12 months
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
                      }}
                    />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {category.bookings} bookings
                    </span>
                    <span className="font-medium">
                      {formatPrice(category.revenue)}
                    </span>
                    <Badge variant="outline">{category.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPerformingEvents.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.bookings} bookings • {event.conversion}% conversion
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(event.revenue)}</p>
                  <p className="text-sm text-muted-foreground">Total revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className={`text-sm font-medium ${
                      activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.amount > 0 ? '+' : ''}{formatPrice(activity.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Events</span>
                <span className="font-medium">{sampleEvents.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Payments</span>
                <span className="font-medium text-yellow-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Failed Payments</span>
                <span className="font-medium text-red-600">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Refunded Bookings</span>
                <span className="font-medium text-gray-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Session Duration</span>
                <span className="font-medium">4m 32s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="font-medium">23.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 