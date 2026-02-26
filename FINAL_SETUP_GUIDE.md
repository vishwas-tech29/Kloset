# Complete Setup Guide - Kloset E-Commerce Store

## 🎯 Overview

Your e-commerce store is fully built with:
- ✅ Complete frontend with animations
- ✅ Backend API with database
- ✅ Stripe payment gateway
- ✅ Men's section with subcategories
- ✅ Video hero background
- ✅ Guest checkout (no authentication)

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Stripe account (free to create)
- Code editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages including:
- Next.js 14
- React 18
- Prisma (database)
- Stripe SDK
- Zustand (state management)
- And more...

### Step 2: Set Up Environment Variables (3 minutes)

Create a `.env.local` file in the root directory:

```env
# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL (optional)
NEXT_PUBLIC_URL=http://localhost:3000
```

**How to get Stripe keys:**
1. Go to [stripe.com](https://stripe.com) and sign up
2. In Dashboard, go to Developers → API keys
3. Copy "Secret key" (starts with `sk_test_`)
4. We'll get webhook secret in Step 4

### Step 3: Set Up Database (2 minutes)

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample products
npm run db:seed
```

This creates:
- SQLite database at `prisma/dev.db`
- 4 categories (Men, Women, Kids, Sale)
- 11 sample products
- 1 coupon code (WELCOME10)

### Step 4: Set Up Stripe Webhooks (3 minutes)

**Option A: Local Development (Recommended)**

1. Install Stripe CLI:
   - Windows: Download from [GitHub releases](https://github.com/stripe/stripe-cli/releases)
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: Download from releases

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Start webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`

**Option B: Skip Webhooks (Testing Only)**
- You can test checkout without webhooks
- Orders will be created but status won't update automatically
- Not recommended for production

### Step 5: Start Development Server (1 minute)

Open TWO terminal windows:

**Terminal 1: Dev Server**
```bash
npm run dev
```

**Terminal 2: Stripe Webhooks** (if using webhooks)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Step 6: Test the Site (5 minutes)

1. Open browser: http://localhost:3000
2. Browse products
3. Add items to cart
4. Go to checkout
5. Fill in test information:
   ```
   Email: test@example.com
   Name: John Doe
   Phone: 1234567890
   Address: 123 Main St
   City: New York
   State: NY
   Postal Code: 10001
   ```
6. Click "Proceed to Payment"
7. Use test card: `4242 4242 4242 4242`
8. Expiry: Any future date (e.g., 12/34)
9. CVC: Any 3 digits (e.g., 123)
10. Complete payment

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Site loads at http://localhost:3000
- [ ] Video plays on homepage
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Cart shows correct items
- [ ] Can go to checkout
- [ ] Form validation works
- [ ] Redirects to Stripe
- [ ] Test payment succeeds
- [ ] Redirects to success page
- [ ] Cart is cleared
- [ ] Order in database (check with `npx prisma studio`)

## 🗂️ Project Structure

```
kloset/
├── app/
│   ├── (shop)/              # Customer pages
│   │   ├── page.tsx         # Homepage with video
│   │   ├── products/        # Product pages
│   │   ├── category/        # Category pages
│   │   │   └── men/         # Men's section
│   │   │       ├── page.tsx
│   │   │       ├── tshirts/
│   │   │       ├── sweatshirts/
│   │   │       └── hoodies/
│   │   ├── cart/            # Shopping cart
│   │   └── checkout/        # Checkout flow
│   └── api/                 # Backend API
│       ├── products/        # Product endpoints
│       ├── orders/          # Order creation
│       ├── checkout/        # Stripe session
│       └── webhooks/        # Stripe webhooks
├── components/
│   ├── layout/              # Navbar, Footer, etc.
│   ├── shop/                # Product cards, grids
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── store/               # Zustand stores
│   ├── utils/               # Helper functions
│   └── validations/         # Zod schemas
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data
└── public/                  # Static assets
```

## 🎨 Key Features

### Homepage
- Video background hero section
- Category cards with images
- Features section
- Newsletter signup
- Responsive design

### Men's Section
- Main category page with subcategories
- T-Shirts collection
- Sweatshirts collection
- Hoodies collection
- Breadcrumb navigation
- Filter and sort options

### Shopping Experience
- Product browsing with filters
- Add to cart (localStorage)
- Wishlist (localStorage)
- Cart drawer
- Guest checkout
- Stripe payment

### Payment Flow
1. Customer fills checkout form
2. Order created in database
3. Stripe session created
4. Redirect to Stripe
5. Customer pays
6. Webhook updates order
7. Success page shown

## 🛠️ Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npm run db:seed          # Seed sample data
```

### Stripe
```bash
stripe login             # Login to Stripe
stripe listen            # Forward webhooks
stripe logs tail         # View Stripe logs
stripe trigger           # Trigger test events
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `STRIPE_SETUP.md` | Detailed Stripe setup |
| `PAYMENT_TESTING.md` | Payment testing guide |
| `PAYMENT_FLOW.md` | Payment flow diagrams |
| `PAYMENT_SUMMARY.md` | Quick payment reference |
| `NO_AUTH_SETUP.md` | No-auth architecture |
| `UPDATES.md` | Recent updates |
| `FINAL_SETUP_GUIDE.md` | This file |

## 🐛 Troubleshooting

### Site won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Reset database
npx prisma db push --force-reset
npm run db:seed
```

### Prisma generate fails
```bash
# Stop dev server first (Ctrl+C)
# Then run:
npx prisma generate
```

### Payment not working
1. Check Stripe keys in `.env.local`
2. Verify webhook is running
3. Check webhook secret is correct
4. Restart dev server

### Video not playing
- Video URL might be slow to load
- Check browser console for errors
- Try a different video URL

## 🎯 Next Steps

### Customize Your Store

1. **Replace Images**
   - Add your product images to `public/`
   - Update image URLs in seed file
   - Replace video URL in homepage

2. **Update Branding**
   - Change "KLOSET" to your brand name
   - Update colors in `tailwind.config.ts`
   - Modify logo and favicon

3. **Add More Products**
   - Edit `prisma/seed.ts`
   - Run `npm run db:seed`
   - Or add via Prisma Studio

4. **Configure Shipping**
   - Update shipping costs in checkout
   - Add more shipping methods
   - Integrate with shipping API

5. **Email Notifications**
   - Set up email service (Resend, SendGrid)
   - Add order confirmation emails
   - Add shipping notifications

### Go Live

1. **Get Live Stripe Keys**
   - Complete Stripe activation
   - Switch to live mode
   - Copy live API keys

2. **Deploy to Production**
   - Vercel (recommended)
   - Netlify
   - Your own server

3. **Set Up Production Webhook**
   - Add webhook in Stripe Dashboard
   - Use production URL
   - Update environment variables

4. **Switch Database**
   - Use PostgreSQL or MySQL
   - Update Prisma schema
   - Migrate data

5. **Monitor**
   - Set up error tracking (Sentry)
   - Monitor Stripe Dashboard
   - Check webhook deliveries

## 💡 Tips

- Keep dev server and webhook forwarding running
- Use Prisma Studio to view database
- Check browser console for errors
- Test with different screen sizes
- Use Stripe test cards for testing
- Never commit `.env.local` to git

## 🆘 Getting Help

### Resources
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)
- **Prisma Docs:** [prisma.io/docs](https://prisma.io/docs)
- **Tailwind Docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Common Issues
- Check all documentation files
- Search error messages online
- Check GitHub issues
- Ask in community forums

## 🎉 You're Ready!

Your e-commerce store is fully set up and ready to use!

**Quick Start:**
1. `npm install`
2. Add Stripe keys to `.env.local`
3. `npx prisma generate && npx prisma db push && npm run db:seed`
4. `npm run dev`
5. Open http://localhost:3000

Happy selling! 🛍️
