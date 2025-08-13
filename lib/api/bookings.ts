import { supabase } from '../supabase';
import { eventsApi } from './events';

export interface Booking {
  $id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  event_image_url?: string;
  event_date: string;
  event_location: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  booking_status: 'confirmed' | 'cancelled' | 'pending';
  customer_name: string;
  customer_email: string;
  booking_date: string;
  // Legacy fields for backward compatibility
  attendee_name?: string;
  attendee_email?: string;
  attendee_phone?: string;
  attendee_gender?: string;
  attendee_age?: number;
  attendee_address?: string;
  payment_amount?: number;
  qr_code?: string;
  status?: string;
  session_id?: string;
  notes?: string;
  discount_code?: string;
  discount_amount?: number;
  created_at?: string;
  updated_at?: string;
}

// Sample data for fallback
const sampleBookings: Booking[] = [
  {
    $id: '1',
    user_id: 'user1',
    event_id: '1',
    event_name: 'Tech Conference 2024',
    event_date: '2024-02-15T10:00:00Z',
    event_location: 'Convention Center, New York',
    ticket_type: 'Regular',
    quantity: 1,
    amount: 299,
    currency: 'USD',
    payment_method: 'PayU',
    payment_status: 'completed',
    transaction_id: 'PAYU_MONEY_1234567',
    booking_status: 'confirmed',
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    booking_date: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    $id: '2',
    user_id: 'user2',
    event_id: '2',
    event_name: 'Music Festival 2024',
    event_date: '2024-03-20T18:00:00Z',
    event_location: 'Central Park, Los Angeles',
    ticket_type: 'VIP',
    quantity: 2,
    amount: 398,
    currency: 'USD',
    payment_method: 'PayU',
    payment_status: 'completed',
    transaction_id: 'PAYU_MONEY_7654321',
    booking_status: 'confirmed',
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@example.com',
    booking_date: '2024-01-14T14:30:00Z',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z'
  }
];

export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error

      const events = await eventsApi.getAll()
      const eventMap = new Map(events.map(e => [e.$id, e]))

      return (data || []).map((b: any) => {
        const ev = eventMap.get(String(b.event_id))
        return {
          $id: String(b.id),
          user_id: b.user_id || '',
          event_id: String(b.event_id || ''),
          event_name: ev?.name || b.notes || 'Event',
          event_image_url: ev?.image_url || undefined,
          event_date: ev?.date || new Date().toISOString(),
          event_location: ev?.venue || 'TBD',
          ticket_type: b.ticket_type || 'General',
          quantity: 1,
          amount: Number(b.payment_amount || 0),
          currency: 'INR',
          payment_method: b.payment_method || 'PayU',
          payment_status: (b.payment_status as any) || 'completed',
          transaction_id: String(b.id),
          booking_status: (b.status as any) || 'confirmed',
          customer_name: b.attendee_name || 'Customer',
          customer_email: b.attendee_email || 'customer@example.com',
          booking_date: b.created_at || new Date().toISOString(),
          created_at: b.created_at,
          updated_at: b.updated_at,
        } as unknown as Booking
      })
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings;
    }
  },

  async getById(id: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const events = await eventsApi.getAll()
      const ev = events.find(e => e.$id === String(data.event_id))
      return {
        $id: String(data.id),
        user_id: data.user_id || '',
        event_id: String(data.event_id || ''),
        event_name: ev?.name || data.notes || 'Event',
        event_image_url: ev?.image_url || undefined,
        event_date: ev?.date || new Date().toISOString(),
        event_location: ev?.venue || 'TBD',
        ticket_type: data.ticket_type || 'General',
        quantity: 1,
        amount: Number(data.payment_amount || 0),
        currency: 'INR',
        payment_method: data.payment_method || 'PayU',
        payment_status: (data.payment_status as any) || 'completed',
        transaction_id: String(data.id),
        booking_status: (data.status as any) || 'confirmed',
        customer_name: data.attendee_name || 'Customer',
        customer_email: data.attendee_email || 'customer@example.com',
        booking_date: data.created_at || new Date().toISOString(),
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as unknown as Booking
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.find(booking => booking.$id === id) || null;
    }
  },

  async create(bookingData: Omit<Booking, '$id' | 'created_at' | 'updated_at'>): Promise<Booking | null> {
    try {
      const payload: any = {
        id: bookingData.transaction_id,
        event_id: bookingData.event_id,
        user_id: bookingData.user_id,
        attendee_name: bookingData.customer_name,
        attendee_email: bookingData.customer_email,
        attendee_phone: '',
        attendee_gender: 'NA',
        attendee_age: 0,
        attendee_address: 'N/A',
        payment_status: bookingData.payment_status,
        payment_amount: bookingData.amount,
        payment_method: bookingData.payment_method,
        qr_code: bookingData.qr_code || 'qr',
        status: bookingData.booking_status,
        ticket_type: bookingData.ticket_type,
        notes: bookingData.event_name,
      }
      const { data, error } = await supabase.from('bookings').insert(payload).select('*').maybeSingle()
      if (error) throw error
      if (!data) return null
      return (await this.getById(String(data.id)))
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async update(id: string, bookingData: Partial<Omit<Booking, '$id' | 'created_at' | 'updated_at'>>): Promise<Booking | null> {
    try {
      const patch: any = {}
      if (bookingData.booking_status) patch.status = bookingData.booking_status
      if (bookingData.payment_status) patch.payment_status = bookingData.payment_status
      if (bookingData.amount !== undefined) patch.payment_amount = bookingData.amount
      if (bookingData.ticket_type) patch.ticket_type = bookingData.ticket_type
      const { data, error } = await supabase
        .from('bookings')
        .update(patch)
        .eq('id', id)
        .select('*')
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return (await this.getById(id))
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id)
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  },

  async getByEvent(eventId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      if (error) throw error
      const events = await eventsApi.getAll()
      const ev = events.find(e => e.$id === String(eventId))
      return (data || []).map((b: any) => ({
        $id: String(b.id),
        user_id: b.user_id || '',
        event_id: String(b.event_id || ''),
        event_name: ev?.name || b.notes || 'Event',
        event_image_url: ev?.image_url || undefined,
        event_date: ev?.date || new Date().toISOString(),
        event_location: ev?.venue || 'TBD',
        ticket_type: b.ticket_type || 'General',
        quantity: 1,
        amount: Number(b.payment_amount || 0),
        currency: 'INR',
        payment_method: b.payment_method || 'PayU',
        payment_status: (b.payment_status as any) || 'completed',
        transaction_id: String(b.id),
        booking_status: (b.status as any) || 'confirmed',
        customer_name: b.attendee_name || 'Customer',
        customer_email: b.attendee_email || 'customer@example.com',
        booking_date: b.created_at || new Date().toISOString(),
        created_at: b.created_at,
        updated_at: b.updated_at,
      }) as unknown as Booking)
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.event_id === eventId);
    }
  },

  async getByUser(userId: string, email?: string): Promise<Booking[]> {
    try {
      // Fetch by user_id
      const { data: byUserId, error: err1 } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (err1) throw err1

      // Optionally fetch legacy bookings by attendee_email
      let byEmail: any[] = []
      if (email) {
        const { data: emailRows } = await supabase
          .from('bookings')
          .select('*')
          .ilike('attendee_email', email)
          .order('created_at', { ascending: false })
        if (emailRows) byEmail = emailRows
      }

      const merged: any[] = []
      const seen = new Set<string>()
      for (const row of [...(byUserId || []), ...byEmail]) {
        const id = String(row.id)
        if (!seen.has(id)) { seen.add(id); merged.push(row) }
      }

      const events = await eventsApi.getAll()
      const eventMap = new Map(events.map(e => [e.$id, e]))
      return (merged || []).map((b: any) => {
        const ev = eventMap.get(String(b.event_id))
        return {
          $id: String(b.id),
          user_id: b.user_id || '',
          event_id: String(b.event_id || ''),
          event_name: ev?.name || b.notes || 'Event',
          event_image_url: ev?.image_url || undefined,
          event_date: ev?.date || new Date().toISOString(),
          event_location: ev?.venue || 'TBD',
          ticket_type: b.ticket_type || 'General',
          quantity: 1,
          amount: Number(b.payment_amount || 0),
          currency: 'INR',
          payment_method: b.payment_method || 'PayU',
          payment_status: (b.payment_status as any) || 'completed',
          transaction_id: String(b.id),
          booking_status: (b.status as any) || 'confirmed',
          customer_name: b.attendee_name || 'Customer',
          customer_email: b.attendee_email || 'customer@example.com',
          booking_date: b.created_at || new Date().toISOString(),
          created_at: b.created_at,
          updated_at: b.updated_at,
        } as unknown as Booking
      })
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.user_id === userId);
    }
  },

  async getByStatus(status: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
      if (error) throw error
      const all = await this.getAll()
      return all.filter(b => b.booking_status === status)
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.booking_status === status);
    }
  },

  async getByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_status', paymentStatus)
        .order('created_at', { ascending: false })
      if (error) throw error
      const all = await this.getAll()
      return all.filter(b => b.payment_status === paymentStatus)
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.payment_status === paymentStatus);
    }
  },

  async search(query: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`attendee_name.ilike.%${query}%,attendee_email.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      if (error) throw error
      const all = await this.getAll()
      const q = query.toLowerCase()
      return all.filter(b =>
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_email.toLowerCase().includes(q) ||
        b.event_name.toLowerCase().includes(q)
      )
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings.filter(booking => 
        booking.customer_name.toLowerCase().includes(query.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(query.toLowerCase()) ||
        booking.event_name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getTotalRevenue(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('payment_amount')
        .eq('payment_status', 'completed')
      if (error) throw error
      return (data || []).reduce((sum: number, r: any) => sum + Number(r.payment_amount || 0), 0)
    } catch (error) {
      console.warn('Supabase not accessible, using sample data:', error);
      return sampleBookings
        .filter(booking => booking.payment_status === 'completed')
        .reduce((total, booking) => total + booking.amount, 0);
    }
  },

  async getStatistics() {
    try {
      const allBookings = await this.getAll();
      const confirmedBookings = allBookings.filter(b => b.booking_status === 'confirmed');
      const pendingBookings = allBookings.filter(b => b.booking_status === 'pending');
      const totalRevenue = await this.getTotalRevenue();

      return {
        total: allBookings.length,
        confirmed: confirmedBookings.length,
        pending: pendingBookings.length,
        revenue: totalRevenue
      };
    } catch (error) {
      console.error('Error getting booking statistics:', error);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        revenue: 0
      };
    }
  }
}; 