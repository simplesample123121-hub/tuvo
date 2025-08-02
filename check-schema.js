const { Client, Databases } = require('node-appwrite');

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '688d133a00190cb1d93c')
    .setKey(process.env.APPWRITE_API_KEY || 'your_api_key');

const databases = new Databases(client);

const databaseId = 'eventbooker_db';
const collectionId = 'users';

async function checkSchema() {
    try {
        console.log('Checking users collection schema...');
        
        // Get collection details
        const collection = await databases.getCollection(databaseId, collectionId);
        console.log('Collection details:', collection);
        
        // Get collection attributes
        const attributes = await databases.listAttributes(databaseId, collectionId);
        console.log('Collection attributes:', attributes);
        
        console.log('✅ Schema check completed!');
    } catch (error) {
        console.error('❌ Error checking schema:', error);
    }
}

checkSchema(); 