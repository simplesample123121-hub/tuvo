import { supabase, type Event as SbEvent } from '../supabase'

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
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      // Map Supabase rows to Event shape
      return (data || []).map((row: any) => ({
        $id: row.id,
        name: row.name || '',
        description: row.description || '',
        date: row.date || '',
        time: row.time || '',
        venue: row.venue || '',
        category: row.category || '',
        price: Number(row.price || 0),
        ticket_count: Number(row.ticket_count || 0),
        available_tickets: Number(row.available_tickets || 0),
        status: row.status || 'upcoming',
        image_url: row.image_url || '',
        created_by: row.created_by || '',
        tags: row.tags || [],
        featured: !!row.featured,
        location: row.location || '',
        created_at: row.created_at || '',
        updated_at: row.updated_at || '',
      }))
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents;
    }
  },

  async getById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        $id: data.id,
        name: data.name || '',
        description: data.description || '',
        date: data.date || '',
        time: data.time || '',
        venue: data.venue || '',
        category: data.category || '',
        price: Number(data.price || 0),
        ticket_count: Number(data.ticket_count || 0),
        available_tickets: Number(data.available_tickets || 0),
        status: data.status || 'upcoming',
        image_url: data.image_url || '',
        created_by: data.created_by || '',
        tags: data.tags || [],
        featured: !!data.featured,
        location: data.location || '',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
      }
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.find(event => event.$id === id) || null;
    }
  },

  async create(eventData: Omit<Event, '$id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    try {
      const payload: any = {
        name: eventData.name,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        category: eventData.category,
        price: eventData.price,
        ticket_count: eventData.ticket_count,
        available_tickets: eventData.available_tickets,
        status: eventData.status,
        image_url: eventData.image_url,
        created_by: eventData.created_by,
        tags: eventData.tags,
        featured: eventData.featured,
        location: eventData.location,
      }
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select('*')
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        $id: data.id,
        ...eventData,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  async update(id: string, eventData: Partial<Omit<Event, '$id' | 'created_at' | 'updated_at'>>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData as any)
        .eq('id', id)
        .select('*')
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        $id: data.id,
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        venue: data.venue,
        category: data.category,
        price: data.price,
        ticket_count: data.ticket_count,
        available_tickets: data.available_tickets,
        status: data.status,
        image_url: data.image_url,
        created_by: data.created_by,
        tags: data.tags,
        featured: data.featured,
        location: data.location,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },

  async search(query: string, category?: string, status?: string): Promise<Event[]> {
    try {
      let req = supabase.from('events').select('*')
        .ilike('name', `%${query}%`)
      if (category) req = req.eq('category', category)
      if (status) req = req.eq('status', status)
      const { data, error } = await req
      if (error) throw error
      return (data || []).map((row: any) => ({
        $id: row.id,
        name: row.name,
        description: row.description,
        date: row.date,
        time: row.time,
        venue: row.venue,
        category: row.category,
        price: row.price,
        ticket_count: row.ticket_count,
        available_tickets: row.available_tickets,
        status: row.status,
        image_url: row.image_url,
        created_by: row.created_by,
        tags: row.tags || [],
        featured: !!row.featured,
        location: row.location || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
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
      const { data, error } = await supabase.from('events').select('*').eq('status', 'upcoming')
      if (error) throw error
      return (data || []).map((row: any) => ({
        $id: row.id,
        name: row.name,
        description: row.description,
        date: row.date,
        time: row.time,
        venue: row.venue,
        category: row.category,
        price: row.price,
        ticket_count: row.ticket_count,
        available_tickets: row.available_tickets,
        status: row.status,
        image_url: row.image_url,
        created_by: row.created_by,
        tags: row.tags || [],
        featured: !!row.featured,
        location: row.location || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.status === 'upcoming');
    }
  },

  async getFeatured(): Promise<Event[]> {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('featured', true)
      if (error) throw error
      return (data || []).map((row: any) => ({
        $id: row.id,
        name: row.name,
        description: row.description,
        date: row.date,
        time: row.time,
        venue: row.venue,
        category: row.category,
        price: row.price,
        ticket_count: row.ticket_count,
        available_tickets: row.available_tickets,
        status: row.status,
        image_url: row.image_url,
        created_by: row.created_by,
        tags: row.tags || [],
        featured: !!row.featured,
        location: row.location || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.featured);
    }
  },

  async getByCategory(category: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('category', category)
      if (error) throw error
      return (data || []).map((row: any) => ({
        $id: row.id,
        name: row.name,
        description: row.description,
        date: row.date,
        time: row.time,
        venue: row.venue,
        category: row.category,
        price: row.price,
        ticket_count: row.ticket_count,
        available_tickets: row.available_tickets,
        status: row.status,
        image_url: row.image_url,
        created_by: row.created_by,
        tags: row.tags || [],
        featured: !!row.featured,
        location: row.location || '',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    } catch (error) {
      console.warn('Appwrite not accessible, using sample data:', error);
      return sampleEvents.filter(event => event.category === category);
    }
  }
}; 