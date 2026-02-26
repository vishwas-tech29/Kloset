# 🚀 Running the Application Locally

## Current Status

✅ **Main Store:** Running at http://localhost:3001
✅ **Admin Panel:** Running at http://127.0.0.1:4000

## How to Start Everything

### 1. Start Main Store (Next.js)

```bash
npm run dev
```

The store will start on port 3000 (or 3001 if 3000 is busy).

**Access at:** http://localhost:3001

### 2. Start Admin Panel (Express)

```bash
cd admin-local/server
npm run dev
```

The admin server will start on port 4000.

**Access at:** http://127.0.0.1:4000 (or open `admin-local/admin.html` in browser)

**Login:** owner / admin123

## Troubleshooting 500 Errors

If you see 500 errors in the browser console, try these steps:

### Step 1: Check if servers are running

```bash
# Check port 3000/3001 (main store)
netstat -ano | findstr :3001

# Check port 4000 (admin)
netstat -ano | findstr :4000
```

### Step 2: Restart the dev server

Stop the current server (Ctrl+C) and restart:

```bash
npm run dev
```

### Step 3: Clear Next.js cache

```bash
# Delete .next folder
rm -rf .next

# Restart
npm run dev
```

### Step 4: Check for Prisma issues

If you see database errors:

```bash
# Regenerate Prisma client
npx prisma generate

# Check database
npx prisma studio
```

### Step 5: Check environment variables

Make sure `.env.local` exists with:

```env
DATABASE_URL="file:./prisma/dev.db"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Common Issues

### Issue: Port already in use

**Error:** `Port 3000 is in use`

**Solution:** Next.js will automatically try port 3001. Or kill the process:

```bash
# Find process
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: Prisma client not generated

**Error:** `@prisma/client did not initialize yet`

**Solution:**

```bash
npx prisma generate
```

### Issue: Database doesn't exist

**Error:** `The table main.Order does not exist`

**Solution:**

```bash
# Run migrations
npx prisma migrate dev

# Seed database
npx tsx prisma/seed.ts
```

### Issue: Module not found errors

**Error:** `Module not found: Can't resolve '@/lib/...'`

**Solution:**

```bash
# Reinstall dependencies
npm install

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

## Testing the Application

### 1. Browse Products

Visit: http://localhost:3001

- Homepage with video hero
- Men's category: http://localhost:3001/category/men
- Products page: http://localhost:3001/products

### 2. Add to Cart

- Click any product
- Select size and color
- Click "Add to Cart"
- View cart in drawer or at http://localhost:3001/cart

### 3. Checkout (Test Mode)

- Go to cart
- Click "Proceed to Checkout"
- Fill in shipping details
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### 4. Admin Panel

- Open http://127.0.0.1:4000 or `admin-local/admin.html`
- Login: owner / admin123
- View dashboard and orders

## Development Workflow

### Making Changes

1. Edit files in your code editor
2. Next.js will auto-reload (Hot Module Replacement)
3. Check browser for changes
4. Check terminal for any errors

### Database Changes

1. Edit `prisma/schema.prisma`
2. Run migration:
   ```bash
   npx prisma migrate dev --name your_change_name
   ```
3. Prisma client will auto-regenerate

### Adding New Pages

1. Create file in `app/(shop)/your-page/page.tsx`
2. Next.js will auto-detect the route
3. Access at http://localhost:3001/your-page

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx tsx prisma/seed.ts   # Seed database
npx prisma generate      # Generate Prisma client

# Admin Panel
cd admin-local/server
npm run dev              # Start admin server
npm run hash-password    # Generate password hash
```

## Environment Setup

### Required Files

1. `.env.local` (main store)
2. `admin-local/server/.env` (admin panel)
3. `prisma/dev.db` (SQLite database)

### Optional Services

- **Stripe:** For payment processing (test mode works without account)
- **Razorpay:** Alternative payment gateway (optional)

## Next Steps

1. ✅ Both servers are running
2. ✅ Database is set up and seeded
3. ✅ Build is working
4. 🚀 Ready to develop or deploy!

## Need Help?

Check these files:
- `README.md` - Project overview
- `DEPLOYMENT_FIXED.md` - Deployment guide
- `admin-local/START_HERE.md` - Admin panel guide
- `PAYMENT_TESTING.md` - Payment testing guide

---

**Current Status:** All systems operational! 🎉
