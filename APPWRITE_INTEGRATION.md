# Appwrite Integration Guide for Ticket Booking Platform

## Overview
This guide explains how to integrate Appwrite as the backend for your ticket booking platform, replacing the current sample data with a real database.

## 1. Appwrite Setup

### 1.1 Install Appwrite SDK
```bash
npm install appwrite
```

### 1.2 Environment Variables
Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID=events
NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=bookings
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID=settings
NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID=analytics
```

## 2. Database Schema

### 2.1 Collections Structure

#### Events Collection (`events`)
```json
{
  "id": "unique_id",
  "name": "Event Name",
  "description": "Event description",
  "date": "2024-03-15",
  "time": "09:00",
  "venue": "Venue Name",
  "category": "Technology",
  "price": 299,
  "ticket_count": 500,
  "available_tickets": 150,
  "status": "upcoming", // upcoming, ongoing, completed
  "image_url": "https://example.com/image.jpg",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "created_by": "user_id",
  "tags": ["tech", "conference"],
  "featured": false,
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }
}
```

#### Bookings Collection (`bookings`)
```json
{
  "id": "unique_id",
  "event_id": "event_id",
  "attendee_name": "John Doe",
  "attendee_email": "john@example.com",
  "attendee_phone": "+1-555-0123",
  "attendee_gender": "male",
  "attendee_age": 28,
  "attendee_address": "123 Main St, New York, NY 10001",
  "payment_status": "completed", // pending, completed, failed, refunded
  "payment_amount": 299,
  "payment_method": "stripe", // stripe, paypal, cash
  "qr_code": "QR123456789",
  "status": "confirmed", // confirmed, pending, cancelled, refunded
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "user_id": "user_id", // if user is logged in
  "session_id": "session_id", // for guest bookings
  "notes": "Special requirements",
  "ticket_type": "regular", // regular, vip, early_bird
  "discount_code": "SUMMER2024",
  "discount_amount": 50
}
```

#### Users Collection (`users`)
```json
{
  "id": "unique_id",
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+1-555-0123",
  "role": "user", // user, admin, super_admin
  "status": "active", // active, inactive, suspended
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "last_login": "2024-01-15T10:00:00Z",
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "User bio",
    "preferences": {
      "email_notifications": true,
      "sms_notifications": false,
      "push_notifications": true
    }
  },
  "addresses": [
    {
      "type": "billing",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zip": "10001"
    }
  ]
}
```

#### Settings Collection (`settings`)
```json
{
  "id": "unique_id",
  "platform_name": "EventHub",
  "platform_description": "Your premier event booking platform",
  "contact_email": "support@eventhub.com",
  "contact_phone": "+1-555-0123",
  "timezone": "UTC",
  "currency": "USD",
  "smtp_config": {
    "host": "smtp.gmail.com",
    "port": "587",
    "username": "noreply@eventhub.com",
    "password": "encrypted_password"
  },
  "payment_config": {
    "stripe_public_key": "pk_test_...",
    "stripe_secret_key": "sk_test_...",
    "paypal_client_id": "client_id_...",
    "paypal_secret": "secret_..."
  },
  "notifications": {
    "email_notifications": true,
    "sms_notifications": false,
    "push_notifications": true,
    "booking_confirmations": true,
    "payment_reminders": true,
    "event_reminders": true
  },
  "security": {
    "two_factor_auth": true,
    "session_timeout": 30,
    "password_policy": "strong",
    "ip_whitelist": ""
  },
  "appearance": {
    "primary_color": "#3b82f6",
    "logo_url": "/logo.png",
    "favicon_url": "/favicon.ico",
    "dark_mode": true
  },
  "integrations": {
    "google_analytics": "GA-XXXXXXXXX",
    "facebook_pixel": "XXXXXXXXXX",
    "google_maps_api": "AIza...",
    "recaptcha_site_key": "6Lc...",
    "recaptcha_secret_key": "6Lc..."
  }
}
```

#### Analytics Collection (`analytics`)
```json
{
  "id": "unique_id",
  "timestamp": "2024-01-15T10:00:00Z",
  "type": "page_view", // page_view, booking, payment, event_created
  "page": "/events",
  "action": "view",
  "metadata": {
    "user_id": "user_id",
    "event_id": "event_id",
    "booking_id": "booking_id",
    "amount": 299,
    "category": "Technology"
  },
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1",
  "session_id": "session_id"
}
```

## 3. Appwrite Client Setup

### 3.1 Create Appwrite Client
Create `lib/appwrite.ts`:

```typescript
import { Client, Databases, Account, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const collections = {
  events: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID!,
  bookings: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID!,
  users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  settings: process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID!,
  analytics: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID!
};
```

## 4. API Functions

### 4.1 Events API
Create `lib/api/events.ts`:

```typescript
import { databases, databaseId, collections } from '../appwrite';
import { ID, Query } from 'appwrite';

export interface Event {
  id: string;
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
  image_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags: string[];
  featured: boolean;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export const eventsApi = {
  // Get all events
  async getAll(): Promise<Event[]> {
    const response = await databases.listDocuments(databaseId, collections.events);
    return response.documents as Event[];
  },

  // Get event by ID
  async getById(id: string): Promise<Event> {
    const response = await databases.getDocument(databaseId, collections.events, id);
    return response as Event;
  },

  // Create event
  async create(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const response = await databases.createDocument(
      databaseId,
      collections.events,
      ID.unique(),
      {
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
    return response as Event;
  },

  // Update event
  async update(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await databases.updateDocument(
      databaseId,
      collections.events,
      id,
      {
        ...eventData,
        updated_at: new Date().toISOString()
      }
    );
    return response as Event;
  },

  // Delete event
  async delete(id: string): Promise<void> {
    await databases.deleteDocument(databaseId, collections.events, id);
  },

  // Search events
  async search(query: string, category?: string, status?: string): Promise<Event[]> {
    let queries = [Query.search('name', query)];
    
    if (category) {
      queries.push(Query.equal('category', category));
    }
    
    if (status) {
      queries.push(Query.equal('status', status));
    }

    const response = await databases.listDocuments(
      databaseId,
      collections.events,
      queries
    );
    return response.documents as Event[];
  },

  // Get upcoming events
  async getUpcoming(): Promise<Event[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.events,
      [Query.equal('status', 'upcoming')]
    );
    return response.documents as Event[];
  },

  // Get featured events
  async getFeatured(): Promise<Event[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.events,
      [Query.equal('featured', true)]
    );
    return response.documents as Event[];
  }
};
```

### 4.2 Bookings API
Create `lib/api/bookings.ts`:

```typescript
import { databases, databaseId, collections } from '../appwrite';
import { ID, Query } from 'appwrite';

export interface Booking {
  id: string;
  event_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  attendee_gender: string;
  attendee_age: number;
  attendee_address: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  payment_method: 'stripe' | 'paypal' | 'cash';
  qr_code: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
  user_id?: string;
  session_id?: string;
  notes?: string;
  ticket_type: 'regular' | 'vip' | 'early_bird';
  discount_code?: string;
  discount_amount?: number;
}

export const bookingsApi = {
  // Get all bookings
  async getAll(): Promise<Booking[]> {
    const response = await databases.listDocuments(databaseId, collections.bookings);
    return response.documents as Booking[];
  },

  // Get booking by ID
  async getById(id: string): Promise<Booking> {
    const response = await databases.getDocument(databaseId, collections.bookings, id);
    return response as Booking;
  },

  // Create booking
  async create(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const response = await databases.createDocument(
      databaseId,
      collections.bookings,
      ID.unique(),
      {
        ...bookingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
    return response as Booking;
  },

  // Update booking
  async update(id: string, bookingData: Partial<Booking>): Promise<Booking> {
    const response = await databases.updateDocument(
      databaseId,
      collections.bookings,
      id,
      {
        ...bookingData,
        updated_at: new Date().toISOString()
      }
    );
    return response as Booking;
  },

  // Delete booking
  async delete(id: string): Promise<void> {
    await databases.deleteDocument(databaseId, collections.bookings, id);
  },

  // Get bookings by event
  async getByEvent(eventId: string): Promise<Booking[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.bookings,
      [Query.equal('event_id', eventId)]
    );
    return response.documents as Booking[];
  },

  // Get bookings by user
  async getByUser(userId: string): Promise<Booking[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.bookings,
      [Query.equal('user_id', userId)]
    );
    return response.documents as Booking[];
  },

  // Get bookings by status
  async getByStatus(status: string): Promise<Booking[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.bookings,
      [Query.equal('status', status)]
    );
    return response.documents as Booking[];
  },

  // Get bookings by payment status
  async getByPaymentStatus(paymentStatus: string): Promise<Booking[]> {
    const response = await databases.listDocuments(
      databaseId,
      collections.bookings,
      [Query.equal('payment_status', paymentStatus)]
    );
    return response.documents as Booking[];
  }
};
```

### 4.3 Settings API
Create `lib/api/settings.ts`:

```typescript
import { databases, databaseId, collections } from '../appwrite';

export interface Settings {
  id: string;
  platform_name: string;
  platform_description: string;
  contact_email: string;
  contact_phone: string;
  timezone: string;
  currency: string;
  smtp_config: {
    host: string;
    port: string;
    username: string;
    password: string;
  };
  payment_config: {
    stripe_public_key: string;
    stripe_secret_key: string;
    paypal_client_id: string;
    paypal_secret: string;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    booking_confirmations: boolean;
    payment_reminders: boolean;
    event_reminders: boolean;
  };
  security: {
    two_factor_auth: boolean;
    session_timeout: number;
    password_policy: string;
    ip_whitelist: string;
  };
  appearance: {
    primary_color: string;
    logo_url: string;
    favicon_url: string;
    dark_mode: boolean;
  };
  integrations: {
    google_analytics: string;
    facebook_pixel: string;
    google_maps_api: string;
    recaptcha_site_key: string;
    recaptcha_secret_key: string;
  };
}

export const settingsApi = {
  // Get settings
  async get(): Promise<Settings> {
    const response = await databases.listDocuments(databaseId, collections.settings);
    return response.documents[0] as Settings;
  },

  // Update settings
  async update(settingsData: Partial<Settings>): Promise<Settings> {
    const currentSettings = await this.get();
    const response = await databases.updateDocument(
      databaseId,
      collections.settings,
      currentSettings.id,
      settingsData
    );
    return response as Settings;
  }
};
```

## 5. Authentication Setup

### 5.1 Create Auth Context
Create `contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await account.createEmailSession(email, password);
    await checkUser();
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 6. Database Permissions

### 6.1 Collection Permissions

#### Events Collection
- **Read**: Anyone
- **Write**: Authenticated users with admin role
- **Update**: Authenticated users with admin role
- **Delete**: Authenticated users with admin role

#### Bookings Collection
- **Read**: Authenticated users (own bookings) or admin
- **Write**: Anyone (for guest bookings)
- **Update**: Authenticated users (own bookings) or admin
- **Delete**: Admin only

#### Users Collection
- **Read**: Authenticated users (own profile) or admin
- **Write**: Admin only
- **Update**: Authenticated users (own profile) or admin
- **Delete**: Admin only

#### Settings Collection
- **Read**: Admin only
- **Write**: Admin only
- **Update**: Admin only
- **Delete**: Admin only

#### Analytics Collection
- **Read**: Admin only
- **Write**: Anyone (for tracking)
- **Update**: Admin only
- **Delete**: Admin only

## 7. Migration Steps

### 7.1 Update Existing Components
1. Replace sample data imports with API calls
2. Update state management to use Appwrite data
3. Add loading states and error handling
4. Implement real-time updates using Appwrite subscriptions

### 7.2 Example: Update Events Page
```typescript
// In app/admin/events/page.tsx
import { useEffect, useState } from 'react';
import { eventsApi, Event } from '@/lib/api/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsApi.getAll();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEvent = await eventsApi.create(eventData);
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // ... rest of the component
}
```

## 8. Security Considerations

1. **API Keys**: Store sensitive keys in environment variables
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Implement rate limiting for API calls
4. **CORS**: Configure CORS properly
5. **Data Encryption**: Use Appwrite's built-in encryption
6. **Backup**: Set up regular database backups

## 9. Performance Optimization

1. **Caching**: Implement client-side caching
2. **Pagination**: Use Appwrite's pagination features
3. **Indexing**: Create proper database indexes
4. **CDN**: Use Appwrite's CDN for file storage
5. **Real-time**: Use Appwrite's real-time features for live updates

## 10. Testing

1. **Unit Tests**: Test API functions
2. **Integration Tests**: Test database operations
3. **E2E Tests**: Test complete user flows
4. **Performance Tests**: Test with large datasets

This integration guide provides a complete foundation for using Appwrite as your backend. The schema is designed to be scalable and maintainable, with proper separation of concerns and security considerations. 