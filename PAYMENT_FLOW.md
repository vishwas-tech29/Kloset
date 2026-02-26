# Payment Flow Diagram

## Complete Payment Process

```
┌─────────────┐
│   Customer  │
│   Browser   │
└──────┬──────┘
       │
       │ 1. Add items to cart (localStorage)
       │
       ▼
┌─────────────────┐
│  Checkout Page  │
│  Fill Form      │
└──────┬──────────┘
       │
       │ 2. Submit form
       │
       ▼
┌──────────────────────────────────────────┐
│  POST /api/orders                        │
│  - Create order in database              │
│  - Status: PENDING                       │
│  - Calculate totals server-side          │
│  - Validate stock availability           │
└──────┬───────────────────────────────────┘
       │
       │ 3. Order created (returns orderId)
       │
       ▼
┌──────────────────────────────────────────┐
│  POST /api/checkout/session              │
│  - Create Stripe checkout session        │
│  - Include order details                 │
│  - Set success/cancel URLs               │
└──────┬───────────────────────────────────┘
       │
       │ 4. Session created (returns URL)
       │
       ▼
┌──────────────────────────────────────────┐
│  Redirect to Stripe Checkout             │
│  - Secure payment page                   │
│  - Hosted by Stripe                      │
│  - Customer enters card details          │
└──────┬───────────────────────────────────┘
       │
       │ 5. Customer completes payment
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
   Success          Canceled          Failed
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Webhook    │  │  Return to   │  │  Show Error  │
│   Triggered  │  │   Checkout   │  │   Message    │
└──────┬───────┘  └──────────────┘  └──────────────┘
       │
       │ 6. checkout.session.completed
       │
       ▼
┌──────────────────────────────────────────┐
│  POST /api/webhooks/stripe               │
│  - Verify webhook signature              │
│  - Update order status: PROCESSING       │
│  - Save payment ID                       │
│  - Decrement stock                       │
└──────┬───────────────────────────────────┘
       │
       │ 7. Order updated
       │
       ▼
┌──────────────────────────────────────────┐
│  Redirect to Success Page                │
│  - Show order confirmation               │
│  - Clear cart                            │
│  - Display order details                 │
└──────────────────────────────────────────┘
```

## Data Flow

### 1. Cart Data (Client-Side)
```javascript
{
  items: [
    {
      id: "item_1",
      productId: "prod_123",
      variantId: "var_456",
      name: "Premium T-Shirt",
      price: 29.99,
      quantity: 2,
      size: "M",
      color: "Black"
    }
  ]
}
```

### 2. Order Creation Request
```javascript
POST /api/orders
{
  guestEmail: "customer@example.com",
  guestName: "John Doe",
  items: [
    {
      productId: "prod_123",
      variantId: "var_456",
      quantity: 2
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    phone: "1234567890",
    addressLine1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States"
  },
  shippingMethod: "standard"
}
```

### 3. Order Created (Database)
```javascript
{
  id: "order_789",
  guestEmail: "customer@example.com",
  guestName: "John Doe",
  status: "PENDING",
  subtotal: 59.98,
  shipping: 5.99,
  tax: 4.80,
  total: 70.77,
  items: [
    {
      productId: "prod_123",
      variantId: "var_456",
      quantity: 2,
      price: 29.99,
      name: "Premium T-Shirt"
    }
  ]
}
```

### 4. Stripe Session Request
```javascript
POST /api/checkout/session
{
  orderId: "order_789"
}
```

### 5. Stripe Session Response
```javascript
{
  success: true,
  data: {
    sessionId: "cs_test_abc123...",
    url: "https://checkout.stripe.com/c/pay/cs_test_abc123..."
  }
}
```

### 6. Webhook Event
```javascript
POST /api/webhooks/stripe
{
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_test_abc123...",
      payment_intent: "pi_xyz789...",
      metadata: {
        orderId: "order_789"
      }
    }
  }
}
```

### 7. Order Updated (Database)
```javascript
{
  id: "order_789",
  status: "PROCESSING",  // Updated
  stripePaymentId: "pi_xyz789...",  // Added
  // ... rest of order data
}
```

## Security Measures

### 1. Server-Side Validation
- ✅ All prices calculated server-side
- ✅ Stock availability checked
- ✅ Order totals verified
- ✅ No client data trusted

### 2. Webhook Verification
- ✅ Signature verification
- ✅ Event type validation
- ✅ Idempotency handling
- ✅ Secure secret storage

### 3. Payment Security
- ✅ No card data touches your server
- ✅ PCI compliance handled by Stripe
- ✅ HTTPS required in production
- ✅ Secure token exchange

## Error Handling

### Payment Failed
```
Customer → Stripe → Payment Failed
                  ↓
            Show Error Message
                  ↓
         Stay on Stripe Page
                  ↓
         Allow Retry
```

### Webhook Failed
```
Stripe → Webhook → Server Error
              ↓
        Automatic Retry
              ↓
    (Up to 3 days of retries)
              ↓
    Check Stripe Dashboard
```

### Stock Unavailable
```
Customer → Submit Order → Check Stock
                        ↓
                   Out of Stock
                        ↓
                  Return Error
                        ↓
              Show Error Message
```

## Status Transitions

```
Order Created
    ↓
[PENDING]
    ↓
Payment Initiated
    ↓
[PENDING]
    ↓
Payment Successful ──→ Webhook Received
    ↓                       ↓
[PROCESSING] ←──────────────┘
    ↓
Order Fulfilled
    ↓
[SHIPPED]
    ↓
Order Delivered
    ↓
[DELIVERED]

Alternative Paths:
[PENDING] → Payment Failed → [CANCELLED]
[PROCESSING] → Refund → [REFUNDED]
```

## API Endpoints

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details (future)

### Payment Processing
- `POST /api/checkout/session` - Create Stripe session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Product Management
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product details
- `GET /api/categories` - List categories

## Database Schema

```
Order
├── id (primary key)
├── guestEmail
├── guestName
├── status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
├── shippingAddress (JSON string)
├── shippingMethod
├── subtotal
├── shipping
├── tax
├── total
├── stripePaymentId
├── createdAt
└── items (relation)
    └── OrderItem
        ├── id
        ├── orderId
        ├── productId
        ├── variantId
        ├── quantity
        ├── price
        ├── name
        └── image
```

## Testing Checklist

- [ ] Order creation works
- [ ] Stripe session created
- [ ] Redirect to Stripe works
- [ ] Test card payment succeeds
- [ ] Webhook received
- [ ] Order status updated
- [ ] Stock decremented
- [ ] Success page shown
- [ ] Cart cleared
- [ ] Email sent (future feature)

## Production Checklist

- [ ] Live Stripe keys configured
- [ ] Production webhook set up
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Error monitoring set up
- [ ] Webhook delivery monitoring
- [ ] Email notifications configured
- [ ] Customer support process defined
- [ ] Refund process documented
- [ ] Test with real card (small amount)
