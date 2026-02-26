# 🎯 Next.js Admin Panel Guide

## ✅ What's Been Created

A complete, secure admin panel built with Next.js that can be deployed to Vercel!

### Features:
- 📊 **Dashboard** - Real-time statistics and recent orders
- 📦 **Order Management** - View, filter, and update order status
- 🛍️ **Product Catalog** - Browse all products with stock info
- 🔐 **Simple Authentication** - Password-protected access
- 📱 **Responsive Design** - Works on desktop and mobile
- 🚀 **Vercel Ready** - Can be deployed alongside your store

## 🌐 Access the Admin Panel

### Local Development:
```
http://localhost:3001/admin
```

### Production (Vercel):
```
https://kloset-zed5-lilac.vercel.app/admin
```

### Default Login:
- **Password:** `admin123`

## 📁 File Structure

```
app/
├── (admin)/
│   ├── layout.tsx              # Admin layout with sidebar
│   └── admin/
│       ├── page.tsx            # Dashboard
│       ├── orders/
│       │   └── page.tsx        # Order management
│       ├── products/
│       │   └── page.tsx        # Product catalog
│       └── login/
│           └── page.tsx        # Login page
│
└── api/
    └── admin/
        ├── auth/
        │   └── route.ts        # Authentication
        ├── stats/
        │   └── route.ts        # Dashboard statistics
        └── orders/
            ├── route.ts        # List orders
            └── [id]/
                └── route.ts    # Update order status
```

## 🔐 Security Setup

### 1. Change Default Password

Add to your `.env.local` (local) and Vercel environment variables (production):

```env
ADMIN_PASSWORD=your_secure_password_here
```

### 2. Add IP Whitelisting (Optional)

For extra security, you can restrict admin access to specific IPs in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to "Firewall"
3. Add your IP addresses to the allowlist
4. Apply rules to `/admin/*` paths

### 3. Enable 2FA (Recommended for Production)

For production, consider upgrading to NextAuth.js:

```bash
npm install next-auth
```

Then replace the simple password auth with proper OAuth providers.

## 📊 Dashboard Features

### Statistics Cards:
- **New Orders Today** - Orders placed today
- **Pending Orders** - Orders awaiting processing
- **Processing Orders** - Orders being prepared
- **Total Revenue** - Revenue from completed orders

### Recent Orders Table:
- Last 10 orders
- Customer details
- Order status
- Order date
- Quick view of order totals

### Auto-Refresh:
- Dashboard updates every 30 seconds automatically
- Always shows latest data

## 📦 Order Management

### View Orders:
- See all orders in chronological order
- Click any order to view full details

### Order Details:
- Customer information
- Shipping address
- Order items with quantities
- Total amount
- Current status

### Update Order Status:
- **Processing** - Order is being prepared
- **Shipped** - Order has been shipped
- **Delivered** - Order delivered to customer

### Order Statuses:
- 🟡 **PENDING** - New order, needs attention
- 🔵 **PROCESSING** - Being prepared
- 🟣 **SHIPPED** - On the way to customer
- 🟢 **DELIVERED** - Successfully delivered
- 🔴 **CANCELLED** - Order cancelled

## 🛍️ Product Catalog

### View Products:
- Grid view of all products
- Product images
- Prices and stock levels
- Published/Draft status
- Featured products highlighted

### Product Stats:
- Total products count
- Published products
- Total stock across all variants

## 🚀 Deployment to Vercel

### Step 1: Push to Git

```bash
git add .
git commit -m "Add Next.js admin panel"
git push origin main
```

### Step 2: Vercel Auto-Deploy

Vercel will automatically detect the changes and deploy.

### Step 3: Set Environment Variables

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add:
   ```
   ADMIN_PASSWORD=your_secure_password
   ```
3. Redeploy if needed

### Step 4: Access Admin

Visit: `https://your-site.vercel.app/admin`

## 🔧 Customization

### Change Colors:

Edit `app/(admin)/layout.tsx`:

```tsx
// Change primary color from #C8A97E to your brand color
className="text-[#YOUR_COLOR]"
```

### Add More Features:

1. **Product Management:**
   - Create `app/(admin)/admin/products/new/page.tsx`
   - Add form to create/edit products

2. **Customer Management:**
   - Create `app/(admin)/admin/customers/page.tsx`
   - View customer orders and details

3. **Analytics:**
   - Create `app/(admin)/admin/analytics/page.tsx`
   - Add charts with recharts or chart.js

4. **Settings:**
   - Create `app/(admin)/admin/settings/page.tsx`
   - Store settings, shipping rates, etc.

### Add Email Notifications:

Install Resend or SendGrid:

```bash
npm install resend
```

Send email when order status changes:

```typescript
// In app/api/admin/orders/[id]/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// After updating order status
await resend.emails.send({
  from: 'orders@yourdomain.com',
  to: order.guestEmail,
  subject: `Order ${order.id} - Status Update`,
  html: `Your order status has been updated to: ${newStatus}`,
});
```

## 🛡️ Security Best Practices

### For Production:

1. **Use Strong Password:**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols
   - Store in environment variables

2. **Enable HTTPS:**
   - Vercel provides this automatically
   - Never access admin over HTTP

3. **Add Rate Limiting:**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

4. **Implement Audit Logging:**
   - Log all admin actions
   - Track who changed what and when

5. **Use NextAuth.js:**
   - Replace simple password with OAuth
   - Add Google/GitHub login
   - Implement role-based access

6. **Add CSRF Protection:**
   - Use Next.js built-in CSRF tokens
   - Validate all POST/PATCH/DELETE requests

## 📱 Mobile Access

The admin panel is fully responsive:

- **Desktop:** Full sidebar navigation
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom navigation (can be added)

To add mobile navigation, create a bottom nav component.

## 🔄 Comparison: Old vs New Admin

### Old Admin (admin-local):
- ❌ Localhost only
- ❌ Separate Express server
- ❌ Can't deploy to Vercel
- ❌ HTML/JavaScript only
- ✅ Thermal printer support

### New Admin (Next.js):
- ✅ Can deploy to Vercel
- ✅ Integrated with main app
- ✅ React components
- ✅ Type-safe with TypeScript
- ✅ Responsive design
- ✅ Auto-refresh
- ❌ No thermal printer (yet)

## 🎯 Next Steps

### Immediate:
1. ✅ Admin panel is ready
2. ⚠️ Change default password
3. ⚠️ Test on local dev server
4. ⚠️ Deploy to Vercel

### Short-term:
1. Add product creation/editing
2. Add customer management
3. Implement email notifications
4. Add analytics dashboard

### Long-term:
1. Upgrade to NextAuth.js
2. Add role-based permissions (admin, manager, viewer)
3. Implement audit logging
4. Add bulk operations
5. Create mobile app

## 🆘 Troubleshooting

### Issue: Can't access /admin

**Solution:** Make sure dev server is running:
```bash
npm run dev
```

### Issue: Login not working

**Solution:** Check if ADMIN_PASSWORD is set:
```bash
# .env.local
ADMIN_PASSWORD=admin123
```

### Issue: Orders not showing

**Solution:** Make sure database has orders:
```bash
npx tsx prisma/seed.ts
```

### Issue: 404 on /admin after deploy

**Solution:** Vercel should auto-detect routes. Try:
1. Check build logs
2. Redeploy
3. Clear Vercel cache

## 📞 Support

- **Documentation:** Check this file
- **API Docs:** See `API.md`
- **Local Admin:** See `admin-local/START_HERE.md`

## 🎉 Success!

Your admin panel is now ready to use! Access it at:

**Local:** http://localhost:3001/admin
**Production:** https://kloset-zed5-lilac.vercel.app/admin

**Default Password:** admin123 (change this!)

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Prisma
**Deployed on:** Vercel
**Security:** Password-protected, HTTPS, Environment variables
