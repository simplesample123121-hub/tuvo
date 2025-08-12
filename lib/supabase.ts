import { createClient, SupabaseClient } from '@supabase/supabase-js'

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
  user_id?: string
  attendee_name: string
  attendee_email: string
  attendee_phone: string
  attendee_gender: string
  attendee_age: number
  attendee_address: string
  payment_status: 'pending' | 'completed' | 'failed'
  payment_amount: number
  payment_method?: string
  qr_code: string
  status: 'confirmed' | 'cancelled' | 'refunded'
  ticket_type?: string
  notes?: string
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

// Server client (service role) for server routes only
export function createSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}