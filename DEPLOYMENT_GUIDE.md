# 🚀 Deployment Guide for Ticket Booking Platform

This guide will help you deploy your Ticket Booking Platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- Git repository set up
- Appwrite project configured
- PayU merchant account (for payments)

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Step 1: Prepare Your Repository**
```bash
# Ensure your code is pushed to GitHub/GitLab/Bitbucket
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**Step 2: Deploy on Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your repository
4. Vercel will automatically detect it's a Next.js project

**Step 3: Configure Environment Variables**
In your Vercel project settings, add these environment variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=688d133a00190cb1d93c
NEXT_PUBLIC_APPWRITE_DATABASE_ID=eventbooker_db
NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID=events
NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=bookings
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID=settings
NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID=analytics
APPWRITE_API_KEY=your_appwrite_api_key_here

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Base URL for your deployed application
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app

# PayU Configuration (update with your production keys)
PAYU_KEY=your_payu_key
PAYU_SALT=your_payu_salt
```

**Step 4: Deploy**
1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a URL like `https://your-app-name.vercel.app`

### Option 2: Netlify

**Step 1: Build Configuration**
The project includes a `netlify.toml` file for Netlify deployment.

**Step 2: Deploy on Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Connect your repository
3. Configure the same environment variables as above
4. Deploy

### Option 3: Self-Hosted (VPS/Server)

**Step 1: Prepare Your Server**
```bash
# Install Node.js 18+ and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

**Step 2: Deploy Your Application**
```bash
# Clone your repository
git clone your-repository-url
cd your-project

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your production values

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "ticket-booking" -- start
pm2 save
pm2 startup
```

**Step 3: Configure Nginx (Optional)**
Use the provided `nginx.conf` file for reverse proxy configuration.

### Option 4: Docker Deployment

**Step 1: Build and Run**
```bash
# Build the Docker image
docker build -t ticket-booking-platform .

# Run the container
docker run -p 3000:3000 --env-file .env.local ticket-booking-platform
```

## 🔧 Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] Appwrite API keys and configuration
- [ ] PayU production keys (not test keys)
- [ ] Correct base URL for your deployment
- [ ] All required environment variables set

### ✅ Database Setup
- [ ] Appwrite collections created
- [ ] Proper permissions configured
- [ ] Sample data if needed

### ✅ Payment Gateway
- [ ] PayU production account
- [ ] Correct merchant keys
- [ ] Webhook URLs configured

### ✅ Domain & SSL
- [ ] Custom domain (optional but recommended)
- [ ] SSL certificate (automatic with Vercel/Netlify)

## 🚨 Common Issues & Solutions

### TypeScript Build Errors
If you encounter TypeScript errors during build:

1. **Fix ID Field Issues**: Ensure all database objects use `$id` instead of `id`
2. **Update Type Definitions**: Check that interfaces match your database schema
3. **Handle Optional Fields**: Add null checks for optional fields like `created_at`

### Environment Variable Issues
- Ensure all `NEXT_PUBLIC_` variables are set for client-side access
- Check that API keys have correct permissions
- Verify PayU keys are for production, not test environment

### Database Connection Issues
- Verify Appwrite project ID and API key
- Check collection permissions
- Ensure database and collections exist

## 📊 Post-Deployment

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor application performance
- Track payment success rates

### Maintenance
- Regular dependency updates
- Database backups
- Security patches

### Scaling
- Consider CDN for static assets
- Database optimization
- Caching strategies

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **API Keys**: Use environment variables for all API keys
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: Ensure all user inputs are validated
5. **Rate Limiting**: Implement rate limiting for API endpoints

## 📞 Support

If you encounter issues during deployment:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure your Appwrite project is properly configured
4. Test the application locally before deploying

## 🎉 Success!

Once deployed, your Ticket Booking Platform will be accessible at your chosen URL. Users can:
- Browse and book events
- Make payments through PayU
- Access admin dashboard (if configured)
- Manage their bookings

Remember to test all functionality thoroughly in the production environment! 