import { Client, Databases, Account, Storage } from 'appwrite';

// Appwrite Configuration
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('688d133a00190cb1d93c');

// Note: API key is not needed for client-side operations
// Server-side operations should use the Appwrite SDK with proper authentication

// Initialize services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);



// Database and Collection IDs
export const databaseId = 'eventbooker_db';
export const collections = {
  events: 'events',
  bookings: 'bookings',
  users: 'users',
  settings: 'settings',
  analytics: 'analytics'
};

// Environment variables (for production)
export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '688d133a00190cb1d93c',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'eventbooker_db',
  collections: {
    events: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || 'events',
    bookings: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings',
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    settings: process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || 'settings',
    analytics: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics'
  }
};

// Export client for direct use if needed
export default client; 