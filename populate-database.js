const { Client, Databases, ID } = require('node-appwrite');

// Appwrite Configuration
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('688d133a00190cb1d93c')
    .setKey(process.env.APPWRITE_API_KEY); // You'll need to set this

const databases = new Databases(client);
const databaseId = 'eventbooker_db';
const eventsCollectionId = 'events';

// Sample events data
const sampleEvents = [
  {
    name: 'Tech Conference 2024',
    description: 'Join us for the biggest technology conference of the year. Learn from industry experts, network with professionals, and discover the latest trends in technology.',
    date: '2024-03-15',
    time: '09:00',
    venue: 'Convention Center, Downtown',
    category: 'Technology',
    price: 299,
    ticket_count: 200,
    available_tickets: 150,
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    created_by: 'admin',
    tags: ['technology', 'conference'],
    featured: true,
    location: JSON.stringify({ address: 'Convention Center, Downtown', city: 'Metropolis', state: 'CA', country: 'USA', coordinates: { latitude: 0, longitude: 0 } })
  },
  {
    name: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world. Experience amazing performances, great food, and unforgettable memories.',
    date: '2024-06-20',
    time: '18:00',
    venue: 'Central Park Amphitheater',
    category: 'Music',
    price: 199,
    ticket_count: 1000,
    available_tickets: 800,
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    created_by: 'admin',
    tags: ['music', 'festival'],
    featured: true,
    location: JSON.stringify({ address: 'Central Park Amphitheater', city: 'Metropolis', state: 'CA', country: 'USA', coordinates: { latitude: 0, longitude: 0 } })
  },
  {
    name: 'Food & Wine Expo',
    description: 'Taste the finest cuisines and wines from renowned chefs and wineries. A culinary experience you won\'t want to miss.',
    date: '2024-04-10',
    time: '14:00',
    venue: 'Grand Hotel Ballroom',
    category: 'Food & Drink',
    price: 149,
    ticket_count: 100,
    available_tickets: 75,
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    created_by: 'admin',
    tags: ['food', 'wine'],
    featured: false,
    location: JSON.stringify({ address: 'Grand Hotel Ballroom', city: 'Metropolis', state: 'CA', country: 'USA', coordinates: { latitude: 0, longitude: 0 } })
  }
];

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    for (const eventData of sampleEvents) {
      const documentId = ID.unique();
      console.log(`Creating event: ${eventData.name}`);
      
      const result = await databases.createDocument(
        databaseId,
        eventsCollectionId,
        documentId,
        eventData
      );
      
      console.log(`✅ Created event with ID: ${result.$id}`);
    }
    
    console.log('🎉 Database population completed successfully!');
    console.log('Your app should now show real events from Appwrite.');
    
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    console.log('\n📝 Manual steps to add events:');
    console.log('1. Go to Appwrite Console → Databases → eventbooker_db → events');
    console.log('2. Click "Add Document"');
    console.log('3. Add the sample event data manually');
  }
}

// Run the population
populateDatabase(); 