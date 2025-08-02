const { Client, Databases, Permission, Role } = require('node-appwrite');

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || 'your_project_id')
    .setKey(process.env.APPWRITE_API_KEY || 'your_api_key');

const databases = new Databases(client);

const databaseId = 'eventbooker_db';

async function setupPermissions() {
    try {
        console.log('Setting up permissions for collections...');

        // List of collections to update
        const collections = ['events', 'bookings', 'users', 'settings', 'analytics'];

        for (const collectionName of collections) {
            try {
                console.log(`Updating permissions for ${collectionName}...`);
                
                // Update collection permissions to allow public read access
                await databases.updateCollection(
                    databaseId,
                    collectionName,
                    collectionName,
                    [
                        Permission.read(Role.any()), // Allow anyone to read
                        Permission.create(Role.users()), // Allow authenticated users to create
                        Permission.update(Role.users()), // Allow authenticated users to update
                        Permission.delete(Role.users()) // Allow authenticated users to delete
                    ]
                );
                
                console.log(`✅ Permissions updated for ${collectionName}`);
            } catch (error) {
                console.error(`❌ Error updating ${collectionName}:`, error.message);
            }
        }

        console.log('🎉 Permission setup completed!');
    } catch (error) {
        console.error('❌ Error setting up permissions:', error);
    }
}

setupPermissions(); 