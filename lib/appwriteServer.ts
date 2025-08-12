import { Client, Databases } from 'appwrite'

// Server-side Appwrite client (uses API key)
export function createServerAppwriteClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '688d133a00190cb1d93c')

  const apiKey = process.env.APPWRITE_API_KEY
  if (!apiKey) {
    throw new Error('APPWRITE_API_KEY is not set')
  }
  // @ts-expect-error setKey exists in Node runtime
  client.setKey(apiKey)
  return client
}

export function getServerDatabases() {
  const client = createServerAppwriteClient()
  return new Databases(client)
}

export const serverDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'eventbooker_db'
export const serverCollections = {
  events: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || 'events',
  bookings: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings',
  users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  settings: process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || 'settings',
  analytics: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
}


