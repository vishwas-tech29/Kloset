# Kloset - E-Commerce Clothing Store

A modern, production-ready e-commerce platform built with Next.js 14, featuring a complete guest shopping experience for clothing retail.

## Features

- **Modern Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma + SQLite
- **Guest Checkout**: No authentication required - simple shopping experience
- **State Management**: Zustand for cart, wishlist, and UI state (localStorage)
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Styling**: shadcn/ui components with Tailwind CSS
- **Payments**: Stripe integration for secure checkout
- **Responsive**: Mobile-first design (375px → 1440px+)

## Project Structure

```
├── app/
│   ├── (shop)/          # Customer-facing pages
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product listing & details
│   │   ├── cart/        # Shopping cart
│   │   └── checkout/    # Checkout flow
│   └── api/             # API routes
│       ├── products/    # Product endpoints
│       ├── orders/      # Order creation
│       ├── checkout/    # Stripe checkout
│       └── webhooks/    # Stripe webhooks
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── shop/            # Shop-specific components
├── lib/
│   ├── store/           # Zustand stores
│   ├── utils/           # Utility functions
│   └── validations/     # Zod schemas
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
└── types/               # TypeScript types
```

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

## Environment Variables

Create `.env.local` file in the root directory:

```env
# Stripe Payment Gateway (required)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional
NEXT_PUBLIC_URL=http://localhost:3000
```

See `STRIPE_SETUP.md` for detailed Stripe configuration instructions.

3. **Set up database**:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Key Pages

### Customer Pages
- **Homepage** (`/`) - Hero, categories, featured products
- **Products** (`/products`) - Product listing with filters
- **Product Detail** (`/products/[slug]`) - Full product page
- **Category** (`/category/[category]`) - Category-specific products
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Guest checkout with Stripe

## Features Implemented

### Shopping Experience
- Product browsing by category
- Product detail with image gallery
- Size and color selection
- Add to cart with variant support
- Wishlist functionality (localStorage)
- Cart drawer with live updates
- Guest checkout with email
- Stripe payment integration
- Order confirmation

### State Management
- Persistent cart (localStorage with Zustand)
- Persistent wishlist (localStorage with Zustand)
- UI state (modals, drawers, mobile menu)
- Optimistic updates

### Forms & Validation
- Checkout form with address validation
- Email validation for guest orders
- Error handling and toast notifications

### Design System
- Consistent color palette (Gold/Tan accent: #C8A97E)
- Typography: Inter (body), Playfair Display (headings)
- Responsive grid layouts
- Smooth animations with Framer Motion
- Accessible components

## Database Schema

Simplified schema for guest shopping:
- **Product** - Product information
- **ProductImage** - Product images
- **Variant** - Size/color/stock variants
- **Category** - Product categories
- **Tag** - Product tags
- **Order** - Guest orders with email
- **OrderItem** - Order line items
- **Review** - Guest product reviews
- **Coupon** - Discount codes

See `NO_AUTH_SETUP.md` for detailed schema information.

## Payment Gateway

This store uses **Stripe** for secure payment processing.

### Features:
- Secure checkout hosted by Stripe
- Support for all major credit cards
- Real-time payment processing
- Automatic order status updates via webhooks
- Test mode for development
- PCI compliance handled by Stripe

### Setup:
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env.local`
4. Set up webhooks for order status updates

See `STRIPE_SETUP.md` for complete setup instructions and `PAYMENT_TESTING.md` for testing guide.

### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 9995`
- Use any future expiry date and any 3-digit CVC



- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form
- **Validation**: Zod
- **Animations**: Framer Motion
- **Payments**: Stripe
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## API Routes

- `GET /api/products` - List products
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/categories` - List categories
- `POST /api/orders` - Create guest order
- `POST /api/checkout/session` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Development

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Reset database
npx prisma db push --force-reset
npm run db:seed
```

### Customization
- **Colors**: Update `tailwind.config.ts` and `app/globals.css`
- **Fonts**: Modify font imports in `app/layout.tsx`
- **Components**: All UI components are in `components/ui/`
- **Products**: Add more products in `prisma/seed.ts`

## Performance

- Image optimization with `next/image`
- Font optimization with `next/font`
- Code splitting with App Router
- Lazy loading for images
- Optimistic UI updates
- SQLite for fast local development

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js hosting platform.

For production, consider switching from SQLite to PostgreSQL or MySQL.

## Documentation

- `NO_AUTH_SETUP.md` - Details about the no-auth architecture
- `QUICK_START.md` - Quick setup guide
- `API.md` - API documentation

## License

MIT
