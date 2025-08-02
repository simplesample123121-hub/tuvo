# PayU Payment Gateway Integration Guide

This comprehensive guide covers the complete implementation of PayU payment gateway integration for the Ticket Booking Platform, following best practices and security standards.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Implementation](#implementation)
5. [Security Features](#security-features)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

## Overview

The PayU integration provides a secure, reliable payment solution for the ticket booking platform. It includes:

- **Secure Hash Generation**: SHA-512 hash verification for all transactions
- **Webhook Support**: Real-time payment status updates
- **Transaction Verification**: API-based payment status checking
- **Error Handling**: Comprehensive error management
- **Security Validation**: Input sanitization and validation
- **Audit Logging**: Complete transaction logging

## Prerequisites

### 1. PayU Merchant Account
- Sign up for a PayU merchant account
- Complete KYC verification
- Get merchant key and salt from PayU dashboard

### 2. Domain Configuration
- Configure your domain in PayU dashboard
- Set up success, failure, and cancel URLs
- Configure webhook URL for real-time updates

### 3. SSL Certificate
- Ensure your domain has a valid SSL certificate
- PayU requires HTTPS for all payment pages

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# PayU Configuration
NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_merchant_key_here
NEXT_PUBLIC_PAYU_MERCHANT_SALT=your_merchant_salt_here
NEXT_PUBLIC_PAYU_SUCCESS_URL=http://localhost:3000/payment/success
NEXT_PUBLIC_PAYU_FAILURE_URL=http://localhost:3000/payment/failure
NEXT_PUBLIC_PAYU_CANCEL_URL=http://localhost:3000/payment/cancel
NEXT_PUBLIC_PAYU_WEBHOOK_URL=http://localhost:3000/api/payu/webhook

# Production URLs (replace with your domain)
# NEXT_PUBLIC_PAYU_SUCCESS_URL=https://yourdomain.com/payment/success
# NEXT_PUBLIC_PAYU_FAILURE_URL=https://yourdomain.com/payment/failure
# NEXT_PUBLIC_PAYU_CANCEL_URL=https://yourdomain.com/payment/cancel
# NEXT_PUBLIC_PAYU_WEBHOOK_URL=https://yourdomain.com/api/payu/webhook
```

### Test Credentials

For testing, use these official PayU test credentials:

```env
NEXT_PUBLIC_PAYU_MERCHANT_KEY=gtKFFx
NEXT_PUBLIC_PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW
```

## Implementation

### 1. Core Integration Files

#### `lib/payu.ts`
Main PayU integration class with all payment functionality:

```typescript
import { PayUIntegration } from '@/lib/payu';

// Create payment request
const paymentRequest = PayUIntegration.createPaymentRequest(bookingData);

// Verify payment response
const isValid = PayUIntegration.verifyPaymentResponse(response);

// Check payment status
const status = await PayUIntegration.verifyPayUPayment(transactionId);
```

#### `lib/payu-hash-utils.ts`
Hash generation and verification utilities:

```typescript
import { generatePayUHash, verifyPayUResponseHash } from '@/lib/payu-hash-utils';

// Generate hash for payment request
const hash = generatePayUHash(params);

// Verify response hash
const isValid = verifyPayUResponseHash(responseParams);
```

### 2. Payment Flow

#### Step 1: User Fills Booking Form
```typescript
const bookingData = {
  eventId: 'EVENT_001',
  eventName: 'Music Festival 2024',
  attendeeName: 'John Doe',
  attendeeEmail: 'john@example.com',
  attendeePhone: '+919876543210',
  attendeeGender: 'M',
  attendeeAge: 28,
  attendeeAddress: 'Mumbai, Maharashtra',
  ticketType: 'VIP Pass',
  quantity: 1,
  amount: 1500,
  bookingId: 'BK123456789'
};
```

#### Step 2: Create Payment Request
```typescript
// Validate booking data
const validation = PayUIntegration.validateBookingData(bookingData);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}

// Create payment request
const paymentRequest = PayUIntegration.createPaymentRequest(bookingData);
```

#### Step 3: Submit to PayU
```typescript
// Create payment form
const formHtml = PayUIntegration.createPaymentForm(bookingData);

// Submit form to PayU
const tempDiv = document.createElement('div');
tempDiv.innerHTML = formHtml;
document.body.appendChild(tempDiv);
const form = tempDiv.querySelector('form') as HTMLFormElement;
form.submit();
```

#### Step 4: Handle Payment Response
```typescript
// In success/failure page
const params = new URLSearchParams(window.location.search);
const response = Object.fromEntries(params.entries());

// Verify response
const isValid = PayUIntegration.verifyPaymentResponse(response);
if (isValid) {
  const status = PayUIntegration.getPaymentStatus(response);
  // Process successful payment
}
```

### 3. Webhook Processing

#### Webhook Endpoint
```typescript
// app/api/payu/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();
  const formData = new URLSearchParams(body);
  const webhookData = Object.fromEntries(formData.entries());

  // Process webhook
  const paymentStatus = PayUIntegration.processWebhook(webhookData);
  
  // Update booking status
  if (paymentStatus.success) {
    await updateBookingStatus(webhookData.udf2, 'confirmed', paymentStatus);
  }

  return NextResponse.json({ status: 'success' });
}
```

## Security Features

### 1. Hash Verification
- **SHA-512 Hash**: All transactions use SHA-512 hash verification
- **Parameter Validation**: All required parameters are validated
- **Hash String Format**: Exact parameter sequence as per PayU documentation

### 2. Input Sanitization
```typescript
// Sanitize parameters
const sanitizedParams = sanitizePayUParams(params);

// Remove potential script tags and HTML
let sanitizedValue = value
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  .replace(/<[^>]*>/g, '')
  .trim();
```

### 3. Parameter Validation
```typescript
// Validate PayU parameters
const validation = validatePayUParams(params);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}
```

### 4. Secure Transaction IDs
```typescript
// Generate secure transaction ID
const txnid = generateSecureTransactionId();
// Format: TXN_timestamp_random_uuid
```

## Testing

### 1. Test Cards

#### Successful Payment
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP**: `123456`

#### Failed Payment
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### 2. Test Scenarios

#### Scenario 1: Successful Payment
1. Fill booking form with valid data
2. Click "Pay" button
3. Use test card `4111 1111 1111 1111`
4. Complete payment with OTP `123456`
5. Verify redirect to success page
6. Check payment verification

#### Scenario 2: Failed Payment
1. Fill booking form with valid data
2. Click "Pay" button
3. Use test card `4000 0000 0000 0002`
4. Verify redirect to failure page
5. Check error message

#### Scenario 3: Payment Cancellation
1. Fill booking form with valid data
2. Click "Pay" button
3. Cancel payment during process
4. Verify redirect to cancel page
5. Check cancellation message

### 3. Hash Testing

Run the hash generation test:

```bash
cd "Ticket Booking Platform cursor"
node test-payu-hash.js
```

## Production Deployment

### 1. Update Configuration

#### Environment Variables
```env
# Production PayU Configuration
NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_production_merchant_key
NEXT_PUBLIC_PAYU_MERCHANT_SALT=your_production_merchant_salt
NEXT_PUBLIC_PAYU_SUCCESS_URL=https://yourdomain.com/payment/success
NEXT_PUBLIC_PAYU_FAILURE_URL=https://yourdomain.com/payment/failure
NEXT_PUBLIC_PAYU_CANCEL_URL=https://yourdomain.com/payment/cancel
NEXT_PUBLIC_PAYU_WEBHOOK_URL=https://yourdomain.com/api/payu/webhook
```

#### PayU Dashboard Configuration
1. **Switch to Production Mode** in PayU dashboard
2. **Update Merchant Credentials** with production values
3. **Configure Production URLs**:
   - Success URL: `https://yourdomain.com/payment/success`
   - Failure URL: `https://yourdomain.com/payment/failure`
   - Cancel URL: `https://yourdomain.com/payment/cancel`
   - Webhook URL: `https://yourdomain.com/api/payu/webhook`

### 2. SSL Certificate
- Ensure your domain has a valid SSL certificate
- PayU requires HTTPS for all payment pages
- Test SSL configuration with SSL checker tools

### 3. Monitoring
- Set up payment success rate monitoring
- Monitor webhook delivery status
- Track transaction failures and errors
- Set up alerts for payment issues

## Troubleshooting

### Common Issues

#### 1. "Invalid Hash" Error
**Cause**: Hash generation mismatch
**Solution**:
- Verify merchant salt is correct
- Check parameter order in hash string
- Ensure all required parameters are present
- Use debug functions to log hash generation

#### 2. "Missing Parameters" Error
**Cause**: Required parameters not sent
**Solution**:
- Check all required parameters are included
- Verify parameter names match PayU documentation
- Validate parameter values are not empty

#### 3. "Payment Not Processing" Error
**Cause**: Form submission issues
**Solution**:
- Check form action URL is correct
- Verify all form fields are properly set
- Check browser console for JavaScript errors
- Test with different browsers

#### 4. "Webhook Not Received" Error
**Cause**: Webhook configuration issues
**Solution**:
- Verify webhook URL is accessible
- Check webhook URL in PayU dashboard
- Test webhook endpoint manually
- Check server logs for webhook requests

### Debug Steps

#### 1. Enable Debug Logging
```typescript
// Enable hash generation debug
debugHashGeneration(params);

// Enable response verification debug
debugResponseVerification(responseParams);
```

#### 2. Check Browser Console
- Open browser developer tools
- Check Console tab for error messages
- Check Network tab for form submission
- Verify all parameters are sent correctly

#### 3. Verify PayU Dashboard
- Check transaction status in PayU dashboard
- Verify callback URLs are configured
- Check merchant credentials are correct
- Review transaction logs

## API Reference

### PayUIntegration Class

#### Methods

##### `createPaymentRequest(bookingData: BookingData): PayURequest`
Creates a PayU payment request with hash generation.

##### `createPaymentForm(bookingData: BookingData): string`
Creates HTML form for PayU payment submission.

##### `verifyPaymentResponse(response: Record<string, string>): boolean`
Verifies PayU payment response hash.

##### `getPaymentStatus(response: Record<string, string>): PaymentStatus`
Gets payment status from response.

##### `verifyPayUPayment(txnid: string): Promise<PaymentStatus>`
Verifies payment with PayU API.

##### `processWebhook(webhookData: Record<string, string>): PaymentStatus`
Processes PayU webhook data.

##### `validateBookingData(bookingData: BookingData): { isValid: boolean; errors: string[] }`
Validates booking data before payment.

### Hash Utilities

#### Functions

##### `generatePayUHash(params: PayUHashParams): string`
Generates SHA-512 hash for payment request.

##### `verifyPayUResponseHash(params: PayUResponseParams): boolean`
Verifies response hash from PayU.

##### `generateSecureTransactionId(): string`
Generates secure transaction ID.

##### `validatePayUParams(params: Record<string, string>): { isValid: boolean; errors: string[] }`
Validates PayU parameters.

##### `sanitizePayUParams(params: Record<string, string>): Record<string, string>`
Sanitizes parameters for security.

### API Endpoints

#### `POST /api/payu/webhook`
Handles PayU webhook notifications.

#### `POST /api/payu/status`
Checks payment status using transaction ID.

#### `GET /api/payu/status?txnid=TRANSACTION_ID`
Checks payment status using GET request.

## Best Practices

### 1. Security
- Never expose merchant salt in client-side code
- Always verify payment responses server-side
- Use HTTPS for all payment pages
- Implement proper input validation and sanitization
- Log all payment attempts for audit

### 2. Error Handling
- Implement comprehensive error handling
- Provide clear error messages to users
- Log all errors for debugging
- Handle network timeouts gracefully
- Implement retry logic for failed payments

### 3. User Experience
- Show clear payment progress indicators
- Provide helpful error messages
- Offer multiple payment retry options
- Send confirmation emails for successful payments
- Provide 24/7 customer support

### 4. Monitoring
- Monitor payment success rates
- Track transaction failures
- Set up alerts for payment issues
- Monitor webhook delivery status
- Regular security audits

## Support

For additional support:

1. **PayU Documentation**: https://payu.in/docs
2. **PayU Support**: Available in PayU merchant dashboard
3. **Technical Support**: Contact your development team
4. **Community**: Check PayU developer forums

## License

This integration is part of the Ticket Booking Platform and follows the same license terms. 