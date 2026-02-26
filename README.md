# Kloset - E-Commerce Clothing Store

A modern, production-ready e-commerce platform built with Next.js 14, featuring a complete shopping experience for clothing retail.

## Features

- **Modern Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **State Management**: Zustand for cart, wishlist, and UI state
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Styling**: shadcn/ui components with Tailwind CSS
- **Dark Mode**: Built-in theme switching
- **Responsive**: Mobile-first design (375px → 1440px+)

## Project Structure

```
├── app/
│   ├── (shop)/          # Customer-facing pages
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product listing & details
│   │   ├── cart/        # Shopping cart
│   │   └── checkout/    # Checkout flow
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (account)/       # User account pages
│   │   └── account/
│   └── (admin)/         # Admin dashboard
│       └── admin/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── shop/            # Shop-specific components
├── lib/
│   ├── store/           # Zustand stores
│   ├── utils/           # Utility functions
│   └── validations/     # Zod schemas
└── types/               # TypeScript types
```

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Copy `.env.local` and update with your values:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

3. **Run development server**:
```bash
npm run dev
```

4. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Key Pages

### Customer Pages
- **Homepage** (`/`) - Hero, categories, featured products
- **Products** (`/products`) - Product listing with filters
- **Product Detail** (`/products/[slug]`) - Full product page
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Multi-step checkout process
- **Account** (`/account`) - User dashboard and orders

### Admin Pages
- **Dashboard** (`/admin`) - Overview and analytics
- **Products** (`/admin/products`) - Product management
- **Orders** (`/admin/orders`) - Order management
- **Customers** (`/admin/customers`) - Customer management

## Features Implemented

### Shopping Experience
- Product browsing with filters and sorting
- Product detail with image gallery
- Size and color selection
- Add to cart with variant support
- Wishlist functionality
- Cart drawer with live updates
- Multi-step checkout
- Order confirmation

### State Management
- Persistent cart (localStorage)
- Persistent wishlist
- UI state (modals, drawers)
- Optimistic updates

### Forms & Validation
- Login/Register with validation
- Checkout form with address validation
- Product forms for admin
- Error handling and toast notifications

### Design System
- Consistent color palette (Gold/Tan accent: #C8A97E)
- Typography: Inter (body), Playfair Display (headings)
- Responsive grid layouts
- Accessible components
- Dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form
- **Validation**: Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Development

### Adding New Products
Products are currently mocked. To connect to a real API:
1. Create API routes in `app/api/products/`
2. Update hooks in `lib/hooks/useProducts.ts`
3. Configure TanStack Query for data fetching

### Customization
- **Colors**: Update `tailwind.config.ts` and `app/globals.css`
- **Fonts**: Modify font imports in `app/layout.tsx`
- **Components**: All UI components are in `components/ui/`

## Performance

- Image optimization with `next/image`
- Font optimization with `next/font`
- Code splitting with App Router
- Lazy loading for images
- Optimistic UI updates

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js hosting platform.

## License

MIT
