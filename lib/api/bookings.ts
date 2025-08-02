import { databases, databaseId, collections } from '../appwrite';
import { ID, Query } from 'appwrite';

export interface Booking {
  $id: string;
  event_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  attendee_gender: string;
  attendee_age: number;
  attendee_address: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  payment_method: string;
  qr_code: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  user_id?: string;
  session_id?: string;
  notes?: string;
  ticket_type: string;
  discount_code?: string;
  discount_amount?: number;
  created_at?: string; // Made optional since Appwrite handles this
  updated_at?: string; // Made optional since Appwrite handles this
}

// Sample data for fallback
const sampleBookings: Booking[] = [
  {
    $id: '1',
    event_id: '1',
    attendee_name: 'John Doe',
    attendee_email: 'john.doe@example.com',
    attendee_phone: '+1-555-0123',
    attendee_gender: 'male',
    attendee_age: 28,
    attendee_address: '123 Main St, New York, NY 10001',
    payment_status: 'completed',
    payment_amount: 299,
    payment_method: 'stripe',
    qr_code: 'QR123456789',
    status: 'confirmed',
    user_id: 'user1',
    ticket_type: 'regular',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    $id: '2',
    event_id: '2',
    attendee_name: 'Jane Smith',
    attendee_email: 'jane.smith@example.com',
    attendee_phone: '+1-555-0456',
    attendee_gender: 'female',
    attendee_age: 32,
    attendee_address: '456 Oak Ave, Los Angeles, CA 90210',
    payment_status: 'completed',
    payment_amount: 199,
    payment_method: 'stripe',
    qr_code: 'QR987654321',
    status: 'confirmed',
    user_id: 'user2',
    ticket_type: 'regular',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z'
  }
];

export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(databaseId, collections.bookings);
      return response.documents as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings;
    }
  },

  async getById(id: string): Promise<Booking | null> {
    try {
      const response = await databases.getDocument(databaseId, collections.bookings, id);
      return response as Booking;
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
      return response as Booking;
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
      return response as Booking;
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
      return response.documents as Booking[];
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
      return response.documents as Booking[];
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
        [Query.equal('status', status)]
      );
      return response.documents as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => booking.status === status);
    }
  },

  async getByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.bookings,
        [Query.equal('payment_status', paymentStatus)]
      );
      return response.documents as Booking[];
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
        [Query.search('attendee_name', query)]
      );
      return response.documents as Booking[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings.filter(booking => 
        booking.attendee_name.toLowerCase().includes(query.toLowerCase()) ||
        booking.attendee_email.toLowerCase().includes(query.toLowerCase())
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
      const bookings = response.documents as Booking[];
      return bookings.reduce((total, booking) => total + booking.payment_amount, 0);
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleBookings
        .filter(booking => booking.payment_status === 'completed')
        .reduce((total, booking) => total + booking.payment_amount, 0);
    }
  },

  async getStatistics() {
    try {
      const allBookings = await this.getAll();
      const confirmedBookings = allBookings.filter(b => b.status === 'confirmed');
      const pendingBookings = allBookings.filter(b => b.status === 'pending');
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