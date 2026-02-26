# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- TanStack Query (data fetching)
- React Hook Form + Zod (forms & validation)
- Framer Motion (animations)
- shadcn/ui components
- And more...

### 2. Environment Setup

The `.env.local` file is already created with placeholder values. Update these with your actual credentials:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

```
kloset/
├── app/                    # Next.js 14 App Router
│   ├── (shop)/            # Customer-facing routes
│   ├── (auth)/            # Authentication routes
│   ├── (account)/         # User account routes
│   ├── (admin)/           # Admin panel routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Context providers
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Navbar, Footer, etc.)
│   └── shop/              # Shop-specific components
├── lib/
│   ├── store/             # Zustand stores (cart, wishlist, UI)
│   ├── utils/             # Utility functions
│   └── validations/       # Zod validation schemas
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Key Features Implemented

### 1. Shopping Experience
- ✅ Homepage with hero and categories
- ✅ Product listing with filters
- ✅ Product detail page with variants
- ✅ Shopping cart with persistence
- ✅ Wishlist functionality
- ✅ Multi-step checkout
- ✅ Order confirmation

### 2. State Management
- ✅ Cart store (Zustand + localStorage)
- ✅ Wishlist store (Zustand + localStorage)
- ✅ UI store (modals, drawers)

### 3. Authentication
- ✅ Login page
- ✅ Registration page
- ✅ Form validation with Zod

### 4. User Account
- ✅ Account dashboard
- ✅ Order history
- ✅ Profile management (structure)

### 5. Admin Panel
- ✅ Dashboard with stats
- ✅ Product management
- ✅ Order management
- ✅ Admin layout with sidebar

### 6. UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Toast notifications
- ✅ Loading states
- ✅ Smooth animations
- ✅ Accessible components

## Next Steps

### Connect to Backend API

Currently, the app uses mock data. To connect to a real backend:

1. Create API routes in `app/api/`:
```typescript
// app/api/products/route.ts
export async function GET() {
  // Fetch from database
  return Response.json({ products: [] });
}
```

2. Update data fetching hooks:
```typescript
// lib/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      return res.json();
    },
  });
}
```

### Add Payment Integration

1. Install Stripe:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. Create Stripe checkout session in checkout page
3. Handle webhooks for order confirmation

### Add Authentication

1. Install NextAuth.js:
```bash
npm install next-auth
```

2. Configure providers in `app/api/auth/[...nextauth]/route.ts`
3. Protect routes with middleware

### Database Setup

Choose your database:
- **PostgreSQL** with Prisma
- **MongoDB** with Mongoose
- **Supabase** for full backend
- **Firebase** for real-time features

### Image Upload

Implement image upload for products:
- Use Cloudinary, AWS S3, or Vercel Blob
- Add drag-and-drop interface
- Image optimization and resizing

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify
- Any Node.js hosting

## Customization

### Colors
Edit `tailwind.config.ts` and `app/globals.css` to change the color scheme.

### Fonts
Modify font imports in `app/layout.tsx`:
```typescript
import { YourFont } from "next/font/google";
```

### Components
All UI components are in `components/ui/` and can be customized.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Regenerate types
npm run build
```

## Support

For issues or questions:
1. Check the README.md
2. Review Next.js documentation
3. Check component documentation in code comments

## License

MIT License - feel free to use for personal or commercial projects.
