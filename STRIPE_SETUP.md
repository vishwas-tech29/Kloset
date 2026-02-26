# Stripe Payment Gateway Setup Guide

This guide will help you set up Stripe payment processing for your e-commerce store.

## Overview

The payment flow works as follows:
1. Customer fills out checkout form
2. Order is created in database
3. Stripe checkout session is created
4. Customer is redirected to Stripe's secure payment page
5. Customer completes payment
6. Stripe webhook notifies your server
7. Order status is updated
8. Customer is redirected to success page

## Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Complete the registration process
4. Verify your email address

## Step 2: Get API Keys

### For Testing (Development):

1. Log in to your Stripe Dashboard
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### For Production (Live):

1. Complete your Stripe account activation
2. Switch to **Live mode** in the dashboard
3. Go to **Developers** → **API keys**
4. Copy your live keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 3: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Stripe Keys (Use test keys for development)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Webhook Secret (we'll get this in Step 4)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

**Important:** Never commit your `.env.local` file to version control!

## Step 4: Set Up Webhooks

Webhooks allow Stripe to notify your server about payment events.

### For Local Development (Using Stripe CLI):

1. **Install Stripe CLI:**
   - Windows: Download from [https://github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: Download from releases page

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook signing secret** (starts with `whsec_`) and add it to `.env.local`

5. **Keep the CLI running** while testing locally

### For Production (Stripe Dashboard):

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production environment variables

## Step 5: Test the Integration

### Using Test Cards:

Stripe provides test card numbers for testing:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**For all test cards:**
- Use any future expiry date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any postal code (e.g., `12345`)

### Testing Flow:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe CLI webhook forwarding (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Add items to cart and go to checkout

4. Fill in the form with test data

5. Click "Proceed to Payment"

6. You'll be redirected to Stripe's checkout page

7. Use a test card number to complete payment

8. You'll be redirected back to the success page

9. Check your terminal for webhook events

## Step 6: Verify Database

After a successful test payment, check your database:

```bash
npx prisma studio
```

Look for:
- New order in the `Order` table
- Order status should be `PROCESSING`
- `stripePaymentId` should be populated

## API Routes Explained

### `/api/orders` (POST)
Creates a new order in the database with guest information.

**Request:**
```json
{
  "guestEmail": "customer@example.com",
  "guestName": "John Doe",
  "items": [
    {
      "productId": "product_id",
      "variantId": "variant_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States"
  },
  "shippingMethod": "standard"
}
```

### `/api/checkout/session` (POST)
Creates a Stripe checkout session for the order.

**Request:**
```json
{
  "orderId": "order_id_from_previous_step"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### `/api/webhooks/stripe` (POST)
Handles webhook events from Stripe.

**Events handled:**
- `checkout.session.completed` - Updates order to PROCESSING
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Cancels order, restores stock
- `charge.refunded` - Marks order as REFUNDED, restores stock

## Troubleshooting

### "No such customer" error
- Make sure you're using the correct API keys (test vs live)
- Verify the keys in `.env.local` match your Stripe dashboard

### Webhook not receiving events
- Check that Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Verify webhook secret in `.env.local`
- Check server logs for errors

### Payment succeeds but order not updated
- Check webhook endpoint is accessible
- Verify webhook secret is correct
- Look for errors in server logs
- Check Stripe Dashboard → Developers → Webhooks for failed deliveries

### "Invalid API Key" error
- Verify `STRIPE_SECRET_KEY` in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing env variables

## Security Best Practices

1. **Never expose secret keys:**
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Never commit `.env.local` to git
   - Use environment variables in production

2. **Verify webhook signatures:**
   - Always verify webhook signatures (already implemented)
   - Use the webhook secret from Stripe

3. **Use HTTPS in production:**
   - Stripe requires HTTPS for webhooks
   - Use a service like Vercel, Netlify, or your own SSL certificate

4. **Validate amounts:**
   - Always calculate totals server-side (already implemented)
   - Never trust amounts from the client

## Going Live

When you're ready to accept real payments:

1. **Complete Stripe account activation:**
   - Provide business information
   - Add bank account for payouts
   - Verify your identity

2. **Switch to live keys:**
   - Update `.env.local` with live keys
   - Update production environment variables

3. **Set up production webhook:**
   - Add webhook endpoint in Stripe Dashboard
   - Use your production URL
   - Update `STRIPE_WEBHOOK_SECRET`

4. **Test with real card:**
   - Use a real card with a small amount
   - Verify the full flow works
   - Check that webhooks are received

5. **Monitor:**
   - Check Stripe Dashboard regularly
   - Set up email notifications
   - Monitor webhook deliveries

## Support

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)
- **Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## Summary

Your payment gateway is now configured! The checkout flow:

1. ✅ Customer fills checkout form
2. ✅ Order created in database
3. ✅ Stripe session created
4. ✅ Customer redirected to Stripe
5. ✅ Payment processed securely
6. ✅ Webhook updates order status
7. ✅ Customer sees success page

All payment processing happens on Stripe's secure servers - you never handle sensitive card data directly.
