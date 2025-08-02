# PayU Payment Gateway Setup Guide

This guide will help you set up the PayU payment gateway integration for your Ticket Booking Platform.

## Prerequisites

1. **PayU Merchant Account**: Sign up for a PayU merchant account
2. **PayU Credentials**: Get your merchant key and salt from PayU dashboard
3. **Domain Configuration**: Configure your domain in PayU dashboard

## Step 1: Environment Configuration

Create a `.env.local` file in your project root and add the following variables:

```bash
# PayU Configuration
NEXT_PUBLIC_PAYU_MERCHANT_KEY=gtKFFx
NEXT_PUBLIC_PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW
NEXT_PUBLIC_PAYU_ENVIRONMENT=TEST
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Production:**
```bash
NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_production_merchant_key
NEXT_PUBLIC_PAYU_MERCHANT_SALT=your_production_merchant_salt
NEXT_PUBLIC_PAYU_ENVIRONMENT=LIVE
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Step 2: PayU Dashboard Configuration

1. **Login to PayU Dashboard**
   - Go to [PayU Merchant Dashboard](https://merchant.payu.in/)
   - Login with your merchant credentials

2. **Configure Success and Failure URLs**
   - Set Success URL: `https://yourdomain.com/api/payment/verify/{txnid}`
   - Set Failure URL: `https://yourdomain.com/api/payment/verify/{txnid}`

## Step 3: Testing the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the payment flow:**
   - Go to an event page
   - Click "Book Now"
   - Fill in attendee details
   - Click "Pay ₹X" button
   - You'll be redirected to PayU's payment gateway

3. **Test Payment Scenarios:**
   - **Success**: Use PayU test card numbers for successful payments
   - **Failure**: Use invalid card numbers or CVV for failed payments

## Step 4: Production Deployment

1. **Update Environment Variables:**
   - Replace test credentials with production credentials
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain
   - Set `NEXT_PUBLIC_PAYU_ENVIRONMENT=LIVE`

2. **Update PayU Dashboard URLs:**
   - Configure production URLs in PayU dashboard
   - Ensure your domain has SSL certificate (HTTPS required)

## File Structure

```
lib/
├── payu.config.ts          # PayU configuration and utilities
app/
├── api/
│   └── payment/
│       ├── route.ts        # Payment initiation endpoint
│       └── verify/
│           └── [txnid]/
│               └── route.ts # Payment verification endpoint
├── payment/
│   └── [status]/
│       └── [id]/
│           └── page.tsx    # Payment status page
components/
└── payu-payment-form.tsx   # Payment form component
```

## How It Works

1. **Payment Initiation**: User clicks "Pay" button
2. **API Call**: Frontend calls `/api/payment` with booking data
3. **PayU Integration**: Backend creates PayU transaction with hash
4. **Redirect**: User is redirected to PayU payment gateway
5. **Payment**: User completes payment on PayU
6. **Callback**: PayU redirects to verification endpoint
7. **Status Page**: User sees payment status and details

## Troubleshooting

1. **Payment Not Initiating:**
   - Check PayU credentials in environment variables
   - Verify PayU dashboard configuration
   - Check browser console for errors

2. **Payment Verification Failing:**
   - Ensure verification URLs are correctly configured
   - Check PayU dashboard for transaction logs
   - Verify hash generation

3. **Production Issues:**
   - Ensure HTTPS is enabled
   - Verify production credentials
   - Check PayU dashboard for domain configuration

## Support

- **PayU Documentation**: https://payu.in/docs
- **PayU Support**: Available in PayU merchant dashboard
- **Technical Issues**: Check PayU dashboard logs and transaction history

## Security Notes

- Never commit PayU credentials to version control
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Regularly monitor PayU dashboard for suspicious transactions 