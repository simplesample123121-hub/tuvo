const { Client, Projects } = require('node-appwrite');

// Appwrite Configuration
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('688d133a00190cb1d93c')
    .setKey(process.env.APPWRITE_API_KEY); // You'll need to set this

const projects = new Projects(client);

async function updateCORS() {
    try {
        console.log('Updating CORS settings...');
        
        // Update CORS settings to include your Vercel domain
        const result = await projects.updateProjectCORS(
            '688d133a00190cb1d93c',
            [
                'https://localhost:3000',
                'https://tuvo.vercel.app',
                'https://*.vercel.app'
            ]
        );
        
        console.log('✅ CORS settings updated successfully!');
        console.log('Updated domains:', result.cors);
        
    } catch (error) {
        console.error('❌ Error updating CORS settings:', error.message);
        console.log('\n📝 Manual steps to fix CORS:');
        console.log('1. Go to https://cloud.appwrite.io/console');
        console.log('2. Select your project: 688d133a00190cb1d93c');
        console.log('3. Go to Settings → Security');
        console.log('4. Add these domains to CORS:');
        console.log('   - https://tuvo.vercel.app');
        console.log('   - https://*.vercel.app');
        console.log('5. Save changes');
    }
}

// Run the update
updateCORS(); 