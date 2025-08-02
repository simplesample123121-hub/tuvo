# PayU Production Setup Guide

## Current Issue
Your app is using test environment keys (`YtZVuv`) but trying to connect to the production environment (`https://secure.payu.in/_payment`). This causes the "incorrect key or salt value" error.

## Solution

### 1. Get Production Keys from PayU
You need to contact PayU to get your production environment keys:
- **Production Key**: Your actual production merchant key
- **Production Salt**: Your actual production salt value

### 2. Set Environment Variables
Add these to your Vercel environment variables:

```bash
PAYU_KEY=your_production_key_here
PAYU_SALT=your_production_salt_here
```

### 3. How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `PAYU_KEY`
   - **Value**: Your production key from PayU
   - **Environment**: Production
5. Add:
   - **Name**: `PAYU_SALT`
   - **Value**: Your production salt from PayU
   - **Environment**: Production
6. Click **Save**
7. Redeploy your application

### 4. Alternative: Use Test Environment
If you want to test first, you can temporarily switch back to test environment:

1. Change the form action in `app/api/payment/route.ts`:
   ```html
   <form id="payment_post" method="post" action="https://test.payu.in/_payment">
   ```

2. Use test keys (which you already have)

### 5. Verify Setup
After setting up production keys:
1. The payment form will redirect to `https://secure.payu.in/_payment`
2. PayU will accept your production keys
3. Payments will be processed in production environment

## Important Notes
- **Never commit production keys to your code**
- **Always use environment variables for sensitive data**
- **Test thoroughly in test environment before going live**
- **Contact PayU support if you need help with production keys**

## Current Configuration
- **Environment**: Production (`PROD`)
- **Payment URL**: `https://secure.payu.in/_payment`
- **Keys**: Using environment variables with fallback to test keys 