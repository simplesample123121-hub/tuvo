import { Shield, CreditCard, Smartphone, Clock, Users, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your payment information is protected with bank-level security. All transactions are encrypted and secure.'
  },
  {
    icon: CreditCard,
    title: 'Multiple Payment Options',
    description: 'Pay with credit cards, digital wallets, or bank transfers. We support all major payment methods.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Book tickets on any device. Our platform works perfectly on smartphones, tablets, and desktops.'
  },
  {
    icon: Clock,
    title: 'Instant Confirmation',
    description: 'Get your tickets immediately after booking. No waiting, no delays, instant digital delivery.'
  },
  {
    icon: Users,
    title: 'Group Bookings',
    description: 'Book multiple tickets for friends and family. Manage group bookings with ease.'
  },
  {
    icon: Star,
    title: 'Verified Events',
    description: 'All events are verified and vetted. You can trust that every event meets our quality standards.'
  }
]

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-sm text-muted-foreground mb-6">
            <Star className="w-4 h-4" />
            <span>Why Choose Tuvo?</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Features That Set Us Apart
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We make event booking simple, secure, and enjoyable. 
            Here's what sets us apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="leading-relaxed text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 