import { Client, Databases, Account, Storage } from 'appwrite';

// Appwrite Configuration
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('688d133a00190cb1d93c');

// Add API key for server-side operations (if available)
if (typeof window === 'undefined' && process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
}

// Initialize services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Debug: Check if account object is properly initialized
if (typeof window !== 'undefined') {
  console.log('Appwrite Client:', client);
  console.log('Appwrite Account object:', account);
  console.log('Account prototype:', Object.getPrototypeOf(account));
  console.log('Account methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
  console.log('createEmailSession method:', typeof account.createEmailSession);
  console.log('createSession method:', typeof account.createSession);
  console.log('All account properties:', Object.keys(account));
}

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