import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    content: 'EventHub has transformed how we manage our events. The booking process is seamless and our attendees love the easy ticket access.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Tech Conference Attendee',
    content: 'I\'ve booked tickets for multiple tech conferences through EventHub. The platform is intuitive and the customer support is excellent.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Music Festival Goer',
    content: 'Booking tickets for the summer music festival was incredibly easy. The mobile app works perfectly and I got my tickets instantly.',
    rating: 5
  },
  {
    name: 'David Thompson',
    role: 'Business Professional',
    content: 'As someone who attends many business events, I appreciate the professional interface and reliable booking system. Highly recommended!',
    rating: 5
  },
  {
    name: 'Lisa Wang',
    role: 'Art Gallery Owner',
    content: 'We switched to EventHub for our gallery openings and the difference is remarkable. Our guests love the digital tickets.',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'Sports Fan',
    content: 'Quick, secure, and reliable. I\'ve never had an issue with ticket booking. The platform is perfect for sports events.',
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what event organizers and attendees have to say about EventHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold">4.9/5</span>
            <span>from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
} 