import { Shield, CreditCard, Smartphone, Clock, Users, Star } from 'lucide-react'

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
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose EventHub?
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            We make event booking simple, secure, and enjoyable. 
            Here's what sets us apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 