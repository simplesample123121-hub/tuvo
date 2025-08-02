import { databases, databaseId, collections } from '../appwrite';
import { ID, Query } from 'appwrite';

export interface Event {
  $id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  price: number;
  ticket_count: number;
  available_tickets: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image_url: string;
  created_by: string;
  tags: string[];
  featured: boolean;
  location: string; // Changed from object to string to match Appwrite schema
  created_at?: string; // Made optional since Appwrite handles this
  updated_at?: string; // Made optional since Appwrite handles this
}

// Sample data for fallback
const sampleEvents: Event[] = [
  {
    $id: '1',
    name: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
    date: '2024-03-15',
    time: '09:00',
    venue: 'Convention Center',
    category: 'Technology',
    price: 299,
    ticket_count: 500,
    available_tickets: 150,
    status: 'upcoming',
    image_url: '/images/tech-conference.jpg',
    created_by: 'admin',
    tags: ['technology', 'conference', 'innovation'],
    featured: true,
    location: JSON.stringify({
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: { latitude: 37.7749, longitude: -122.4194 }
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    $id: '2',
    name: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world.',
    date: '2024-07-20',
    time: '16:00',
    venue: 'Central Park',
    category: 'Music',
    price: 199,
    ticket_count: 1000,
    available_tickets: 200,
    status: 'upcoming',
    image_url: '/images/music-festival.jpg',
    created_by: 'admin',
    tags: ['music', 'festival', 'summer'],
    featured: true,
    location: JSON.stringify({
      address: 'Central Park',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      coordinates: { latitude: 40.7829, longitude: -73.9654 }
    }),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(databaseId, collections.events);
      return response.documents as Event[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents;
    }
  },

  async getById(id: string): Promise<Event | null> {
    try {
      const response = await databases.getDocument(databaseId, collections.events, id);
      return response as Event;
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.find(event => event.$id === id) || null;
    }
  },

  async create(eventData: Omit<Event, '$id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    try {
      const response = await databases.createDocument(
        databaseId,
        collections.events,
        ID.unique(),
        eventData
      );
      return response as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  async update(id: string, eventData: Partial<Omit<Event, '$id' | 'created_at' | 'updated_at'>>): Promise<Event | null> {
    try {
      const response = await databases.updateDocument(
        databaseId,
        collections.events,
        id,
        eventData
      );
      return response as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(databaseId, collections.events, id);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  async search(query: string, category?: string, status?: string): Promise<Event[]> {
    try {
      const queries = [Query.search('name', query)];
      if (category) queries.push(Query.equal('category', category));
      if (status) queries.push(Query.equal('status', status));
      
      const response = await databases.listDocuments(databaseId, collections.events, queries);
      return response.documents as Event[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => 
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getUpcoming(): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.events,
        [Query.equal('status', 'upcoming')]
      );
      return response.documents as Event[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.status === 'upcoming');
    }
  },

  async getFeatured(): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.events,
        [Query.equal('featured', true)]
      );
      return response.documents as Event[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.featured);
    }
  },

  async getByCategory(category: string): Promise<Event[]> {
    try {
      const response = await databases.listDocuments(
        databaseId,
        collections.events,
        [Query.equal('category', category)]
      );
      return response.documents as Event[];
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.category === category);
    }
  }
}; 