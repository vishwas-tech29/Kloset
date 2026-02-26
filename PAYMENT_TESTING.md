# Quick Payment Testing Guide

## Prerequisites

1. Stripe account created
2. Test API keys added to `.env.local`
3. Dev server running: `npm run dev`
4. Stripe CLI running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Test Cards

### Successful Payment
```
Card: 4242 4242 4242 4242
Expiry: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any postal code)
```

### Declined Payment
```
Card: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### Requires Authentication (3D Secure)
```
Card: 4000 0025 0000 3155
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### Insufficient Funds
```
Card: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
ZIP: 12345
```

## Testing Steps

### 1. Add Items to Cart
- Go to http://localhost:3000
- Browse products
- Add items to cart

### 2. Go to Checkout
- Click cart icon
- Click "Checkout" button
- Fill in shipping information:
  ```
  Email: test@example.com
  Name: John Doe
  Phone: 1234567890
  Address: 123 Main St
  City: New York
  State: NY
  Postal Code: 10001
  Country: United States
  ```

### 3. Select Shipping Method
- Choose Standard or Express shipping

### 4. Proceed to Payment
- Click "Proceed to Payment" button
- You'll be redirected to Stripe's checkout page

### 5. Complete Payment
- Enter test card details
- Click "Pay"
- You'll be redirected to success page

### 6. Verify Order
Open Prisma Studio:
```bash
npx prisma studio
```

Check:
- Order exists in database
- Status is "PROCESSING"
- stripePaymentId is populated

### 7. Check Webhook Events
In the terminal running Stripe CLI, you should see:
```
✔ Received event: checkout.session.completed
✔ Received event: payment_intent.succeeded
```

## Common Test Scenarios

### Test 1: Successful Purchase
1. Use card `4242 4242 4242 4242`
2. Complete checkout
3. Verify order status is "PROCESSING"
4. Check webhook received

### Test 2: Declined Card
1. Use card `4000 0000 0000 9995`
2. Payment should fail
3. Order should not be created
4. User stays on Stripe page with error

### Test 3: Free Shipping
1. Add items totaling over $50
2. Verify shipping shows as "FREE"
3. Complete checkout
4. Verify total is correct

### Test 4: Express Shipping
1. Select "Express Shipping"
2. Verify $15.99 shipping charge
3. Complete checkout
4. Verify order has correct shipping method

### Test 5: Multiple Items
1. Add 3+ different items to cart
2. Complete checkout
3. Verify all items in order
4. Check stock was decremented

## Webhook Testing

### View Webhook Events
In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click on your endpoint
3. View recent events

### Manually Trigger Webhook
```bash
stripe trigger checkout.session.completed
```

### Test Webhook Locally
```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed"}'
```

## Debugging

### Check Server Logs
Look for:
- Order creation logs
- Stripe session creation logs
- Webhook event logs

### Check Stripe Dashboard
1. Go to Payments
2. Find your test payment
3. Click to view details
4. Check events timeline

### Check Database
```bash
npx prisma studio
```

Look at:
- Order table
- OrderItem table
- Variant table (stock levels)

## Environment Variables Checklist

Make sure these are set in `.env.local`:

```env
✓ STRIPE_SECRET_KEY=sk_test_...
✓ STRIPE_WEBHOOK_SECRET=whsec_...
✓ NEXT_PUBLIC_URL=http://localhost:3000
```

## Quick Commands

```bash
# Start dev server
npm run dev

# Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Open Prisma Studio
npx prisma studio

# View Stripe logs
stripe logs tail

# Trigger test webhook
stripe trigger checkout.session.completed
```

## Expected Flow

1. **Checkout Form Submitted**
   - POST to `/api/orders`
   - Order created with status "PENDING"

2. **Stripe Session Created**
   - POST to `/api/checkout/session`
   - Returns Stripe checkout URL

3. **Redirect to Stripe**
   - User enters payment details
   - Stripe processes payment

4. **Webhook Received**
   - `checkout.session.completed` event
   - Order status updated to "PROCESSING"

5. **Success Page**
   - User redirected to `/checkout/success`
   - Cart cleared

## Troubleshooting

### Payment succeeds but order not updated
- Check Stripe CLI is running
- Verify webhook secret
- Check server logs

### "Invalid API Key" error
- Verify `STRIPE_SECRET_KEY` in `.env.local`
- Restart dev server

### Webhook not received
- Check Stripe CLI is running
- Verify forwarding URL is correct
- Check firewall settings

### Order created but payment fails
- This is expected behavior
- Order remains in "PENDING" status
- Can be cleaned up manually or with a cron job

## Success Indicators

✅ Order appears in database
✅ Order status is "PROCESSING"
✅ stripePaymentId is populated
✅ Webhook events received
✅ Stock decremented
✅ User redirected to success page
✅ Cart cleared

## Next Steps

Once testing is complete:
1. Switch to live Stripe keys
2. Set up production webhook
3. Test with real card (small amount)
4. Monitor first few real transactions
5. Set up email notifications
