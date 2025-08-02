import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About EventHub</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Connecting people through amazing events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                EventHub is your premier destination for discovering and booking the best events in your area. 
                From tech conferences to music festivals, we bring you a curated selection of events that inspire, 
                entertain, and connect communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Event Discovery</h3>
                  <p>Browse through thousands of events across different categories and find exactly what you're looking for.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
                  <p>Book tickets with just a few clicks. Our secure payment system ensures a smooth transaction.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Event Management</h3>
                  <p>For event organizers, we provide comprehensive tools to create, manage, and promote your events.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                  <p>Stay informed with real-time updates about your bookings and event changes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                We're a passionate team dedicated to making event discovery and booking seamless and enjoyable. 
                Our platform combines cutting-edge technology with user-friendly design to create the best 
                experience for both event-goers and organizers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 