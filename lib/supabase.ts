import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  price: number
  ticket_count: number
  available_tickets: number
  status: 'upcoming' | 'ongoing' | 'completed'
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  event_id: string
  attendee_name: string
  attendee_email: string
  attendee_phone: string
  attendee_gender: string
  attendee_age: number
  attendee_address: string
  payment_status: 'pending' | 'completed' | 'failed'
  payment_amount: number
  qr_code: string
  status: 'confirmed' | 'cancelled' | 'refunded'
  created_at: string
  updated_at: string
}

export interface AdminProfile {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  timestamp: string
  page: string
  action: string
  metadata: any
  user_id?: string
} 