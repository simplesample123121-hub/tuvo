import { databases, databaseId, collections } from '../appwrite';
import { ID, Query } from 'appwrite';

export interface Booking {
  $id: string;
  user_id: string;
  event_id: string;
  event_name: string;
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
      const response = await databases.listDocuments(databaseId, collections.bookings);
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings;
    }
  },

  async getById(id: string): Promise<Booking | null> {
    try {
      const response = await databases.getDocument(databaseId, collections.bookings, id);
      return response as unknown as Booking;
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.find(booking => booking.$id === id) || null;
    }
  },

  async create(bookingData: Omit<Booking, '$id' | 'created_at' | 'updated_at'>): Promise<Booking | null> {
    try {
      const response = await databases.createDocument(
        databaseId,
        collections.bookings,
        ID.unique(),
        bookingData
      );
      return response as unknown as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async update(id: string, bookingData: Partial<Omit<Booking, '$id' | 'created_at' | 'updated_at'>>): Promise<Booking | null> {
    try {
      const response = await databases.updateDocument(
        databaseId,
        collections.bookings,
        id,
        bookingData
      );
      return response as unknown as Booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(databaseId, collections.bookings, id);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  },

  async getByEvent(eventId: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('event_id', eventId)]
      );
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.event_id === eventId);
    }
  },

  async getByUser(userId: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('user_id', userId)]
      );
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.user_id === userId);
    }
  },

  async getByStatus(status: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('booking_status', status)]
      );
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.booking_status === status);
    }
  },

  async getByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('payment_status', paymentStatus)]
      );
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.payment_status === paymentStatus);
    }
  },

  async search(query: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.search('customer_name', query)]
      );
      return response.documents as unknown as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => 
        booking.customer_name.toLowerCase().includes(query.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(query.toLowerCase()) ||
        booking.event_name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getTotalRevenue(): Promise<number> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('payment_status', 'completed')]
      );
      const bookings = response.documents as unknown as Booking[];
      return bookings.reduce((total, booking) => total + booking.amount, 0);
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
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