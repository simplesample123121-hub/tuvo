# Appwrite Permissions Setup Guide

## 🔧 Manual Permission Setup

Since the automatic push had issues, you need to set up permissions manually in the Appwrite Console.

### Step 1: Access Appwrite Console
1. Go to https://cloud.appwrite.io/console
2. Login to your account
3. Select your project "Eventbooker"

### Step 2: Navigate to Database
1. Click on "Databases" in the left sidebar
2. Click on "EventBooker Database"
3. You should see all 5 collections: events, bookings, users, settings, analytics

### Step 3: Set Permissions for Each Collection

For each collection (events, bookings, users, settings, analytics):

1. **Click on the collection name**
2. **Go to "Settings" tab**
3. **Scroll down to "Permissions" section**
4. **Add these permissions:**
   - `read("any")` - Allows anyone to read data
   - `create("users")` - Allows authenticated users to create
   - `update("users")` - Allows authenticated users to update
   - `delete("users")` - Allows authenticated users to delete

### Step 4: Alternative - Use API Key (Recommended)

Instead of manual setup, you can use an API key approach:

1. **Go to "API Keys" in the left sidebar**
2. **Create a new API key** with these permissions:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`

3. **Add the API key to your environment variables:**
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=688d133a00190cb1d93c
   APPWRITE_API_KEY=your_api_key_here
   ```

### Step 5: Update Your Code

If using API key approach, update your `lib/appwrite.ts`:

```typescript
import { Client, Databases, Account, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '688d133a00190cb1d93c');

// Add API key for server-side operations
if (typeof window === 'undefined') {
    client.setKey(process.env.APPWRITE_API_KEY || '');
}

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export const databaseId = 'eventbooker_db';
export const collections = {
    events: 'events',
    bookings: 'bookings',
    users: 'users',
    settings: 'settings',
    analytics: 'analytics'
};
```

### Step 6: Test the Application

After setting up permissions:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test the application:**
   - Visit http://localhost:3000
   - Try accessing the admin panel
   - Check if data loads without permission errors

## 🚨 Important Notes

- **API Key Approach**: This is more secure and recommended for production
- **Manual Permissions**: Use this for development/testing
- **Anonymous Access**: The `read("any")` permission allows public read access
- **User Authentication**: Users need to be authenticated for create/update/delete operations

## 🔍 Troubleshooting

If you still get permission errors:

1. **Check API Key**: Ensure your API key has the correct permissions
2. **Clear Browser Cache**: Clear your browser cache and cookies
3. **Check Console**: Look for specific error messages in browser console
4. **Verify Project ID**: Ensure you're using the correct project ID

## 📞 Support

If you continue to have issues:
1. Check the Appwrite documentation
2. Verify your project settings
3. Ensure all environment variables are set correctly 