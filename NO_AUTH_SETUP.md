# No Authentication Setup

This e-commerce site has been simplified to work without user authentication. All features work as guest checkout.

## What Was Removed

- All authentication pages (`/login`, `/register`)
- User account pages (`/account/*`)
- Admin dashboard (`/admin/*`)
- NextAuth.js and related dependencies
- User, Account, Session models from database
- Middleware for route protection
- Wishlist API (now handled entirely in localStorage)

## What Still Works

- Browse products and categories
- Add items to cart (localStorage)
- Add items to wishlist (localStorage)
- Guest checkout with email
- Stripe payment integration
- Order creation and tracking

## Database Changes

The Prisma schema has been simplified:
- Removed `User`, `Account`, `Session`, `VerificationToken` models
- Removed `WishlistItem` model (wishlist is now localStorage only)
- Removed `Address` model (shipping address stored as JSON string in Order)
- `Order` model now requires `guestEmail` and `guestName`
- `Review` model now uses `guestName` and `guestEmail` instead of user relation

## Setup Instructions

1. Stop the dev server if running
2. Install dependencies (auth packages removed):
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Push schema to database:
   ```bash
   npx prisma db push
   ```

5. Seed the database:
   ```bash
   npm run db:seed
   ```

6. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

You no longer need:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

You still need:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_URL` (optional, defaults to http://localhost:3000)

## Cart & Wishlist

Both cart and wishlist are now stored entirely in localStorage using Zustand stores:
- `lib/store/cartStore.ts` - Shopping cart with persistence
- `lib/store/wishlistStore.ts` - Wishlist with persistence

No API calls are made for these features.

## Checkout Flow

1. User adds items to cart
2. User goes to checkout page
3. User fills in shipping information and email
4. Order is created in database with guest information
5. User is redirected to Stripe for payment
6. Webhook updates order status on successful payment

## Notes

- Orders are stored in the database with guest email for tracking
- No user accounts means no order history page
- Reviews can be submitted with guest name and email
- All features work without login
