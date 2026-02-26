# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via NextAuth.js session. Include credentials in requests.

### Headers
```
Content-Type: application/json
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": { ... } // Optional validation errors
}
```

---

## Authentication Endpoints

### Register
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "message": "Account created successfully"
  }
}
```

### Login
```http
POST /api/auth/[...nextauth]
```
Handled by NextAuth.js - use NextAuth client methods

---

## Products Endpoints

### List Products
```http
GET /api/products?page=1&limit=12&category=men&search=shirt&sort=newest
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category slug
- `search` (string): Search in name/description
- `sort` (string): `newest`, `price-asc`, `price-desc`, `name`
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `featured` (boolean): Filter featured products

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Get Single Product
```http
GET /api/products/[slug]
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Premium Cotton T-Shirt",
    "slug": "premium-cotton-tshirt",
    "description": "...",
    "price": 49.99,
    "comparePrice": 69.99,
    "images": [...],
    "category": {...},
    "variants": [...],
    "reviews": [...],
    "rating": 4.5,
    "reviewCount": 128,
    "inStock": true
  }
}
```

### Create Product (Admin)
```http
POST /api/products
```

**Body:**
```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "price": 49.99,
  "comparePrice": 69.99,
  "categoryId": "...",
  "images": [
    { "url": "https://...", "publicId": "..." }
  ],
  "variants": [
    { "size": "M", "color": "Black", "stock": 10, "sku": "NP-BLK-M" }
  ],
  "isPublished": true,
  "isFeatured": false
}
```

**Response:** `201 Created`

### Update Product (Admin)
```http
PUT /api/products/[slug]
```

### Delete Product (Admin)
```http
DELETE /api/products/[slug]
```

---

## Categories Endpoints

### List Categories
```http
GET /api/categories
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Men",
      "slug": "men",
      "image": "...",
      "_count": {
        "products": 45
      }
    }
  ]
}
```

### Create Category (Admin)
```http
POST /api/categories
```

**Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "image": "https://...",
  "order": 5
}
```

---

## Orders Endpoints

### Get User Orders
```http
GET /api/orders
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "status": "PROCESSING",
      "total": 129.99,
      "items": [...],
      "shippingAddress": {...},
      "createdAt": "2024-01-15T..."
    }
  ]
}
```

### Create Order
```http
POST /api/orders
```
**Auth Required:** Yes

**Body:**
```json
{
  "items": [
    {
      "productId": "...",
      "variantId": "...",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "555-0123"
  },
  "shippingMethod": "standard",
  "couponCode": "WELCOME10",
  "notes": "Please ring doorbell"
}
```

**Response:** `201 Created`

### Get All Orders (Admin)
```http
GET /api/admin/orders?page=1&limit=20&status=PROCESSING&search=john
```

### Update Order (Admin)
```http
PUT /api/admin/orders/[id]
```

**Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "notes": "Shipped via UPS"
}
```

---

## Checkout & Payments

### Create Checkout Session
```http
POST /api/checkout/session
```
**Auth Required:** Yes

**Body:**
```json
{
  "orderId": "..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Stripe Webhook
```http
POST /api/webhooks/stripe
```
**Headers:**
```
stripe-signature: t=...,v1=...
```

Handles events:
- `checkout.session.completed` → Confirm order
- `payment_intent.payment_failed` → Cancel order
- `charge.refunded` → Refund order

---

## Wishlist Endpoints

### Get Wishlist
```http
GET /api/wishlist
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "product": {...},
      "createdAt": "..."
    }
  ]
}
```

### Add to Wishlist
```http
POST /api/wishlist
```
**Auth Required:** Yes

**Body:**
```json
{
  "productId": "..."
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist/[productId]
```
**Auth Required:** Yes

---

## Account Endpoints

### Get Profile
```http
GET /api/account/profile
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "...",
    "role": "CUSTOMER",
    "emailVerified": "...",
    "createdAt": "..."
  }
}
```

### Update Profile
```http
PUT /api/account/profile
```
**Auth Required:** Yes

**Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "image": "https://..."
}
```

### Change Password
```http
PUT /api/account/password
```
**Auth Required:** Yes

**Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

### Get Addresses
```http
GET /api/account/addresses
```
**Auth Required:** Yes

### Add Address
```http
POST /api/account/addresses
```
**Auth Required:** Yes

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "555-0123",
  "isDefault": true
}
```

---

## Admin Analytics

### Revenue Analytics
```http
GET /api/admin/analytics/revenue?startDate=2024-01-01&endDate=2024-12-31
```
**Auth Required:** Admin

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      { "date": "2024-01-15", "revenue": 1250.50 }
    ],
    "totalRevenue": 45231.89,
    "orderCount": 350
  }
}
```

---

## Rate Limits

- General API: 100 requests/minute
- Auth endpoints: 20 requests/minute
- Checkout: 10 requests/minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Error Codes

- `400` Bad Request - Invalid input
- `401` Unauthorized - Not authenticated
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

---

## Testing

### Test Credentials

**Admin:**
- Email: `admin@kloset.com`
- Password: `admin123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

### Test Coupon
- Code: `WELCOME10`
- Type: 10% off
- Min Order: $50

### Test Stripe Card
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
