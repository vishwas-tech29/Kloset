# Backend Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Stripe account
- Cloudinary account
- Resend account
- Upstash Redis account

## Step 1: Install Dependencies

```bash
npm install
```

This installs all backend dependencies including:
- Prisma (ORM)
- NextAuth.js (Authentication)
- Stripe (Payments)
- Cloudinary (Image uploads)
- Resend (Emails)
- Upstash Redis (Caching & rate limiting)
- bcryptjs (Password hashing)
- Zod (Validation)

## Step 2: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE kloset;
```

3. Update `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kloset"
DIRECT_URL="postgresql://username:password@localhost:5432/kloset"
```

### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection strings from Settings → Database
4. Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### Option C: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string
4. Update `.env.local`

## Step 3: Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate dev --name init
```

## Step 4: Seed Database

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@kloset.com` / `admin123`
- Test customer: `customer@example.com` / `customer123`
- Sample categories (Men, Women, Kids, Sale)
- Sample products with variants
- Test coupon: `WELCOME10`

## Step 5: Configure External Services

### NextAuth.js

1. Generate a secret:
```bash
openssl rand -base64 32
```

2. Update `.env.local`:
```env
NEXTAUTH_SECRET="your_generated_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Update `.env.local`:
```env
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
```

### Stripe

1. Go to [stripe.com](https://stripe.com)
2. Get API keys from Developers → API keys
3. Update `.env.local`:
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

4. Set up webhook:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

5. Copy webhook secret:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from Dashboard
4. Update `.env.local`:
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Resend

1. Go to [resend.com](https://resend.com)
2. Sign up and verify domain
3. Create API key
4. Update `.env.local`:
```env
RESEND_API_KEY="re_..."
```

### Upstash Redis

1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy REST URL and token
4. Update `.env.local`:
```env
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## Step 6: Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Step 7: Test the API

### Using Prisma Studio

```bash
npm run db:studio
```

Opens a GUI to view and edit database records at `http://localhost:5555`

### Using API Client

Test with Postman, Insomnia, or curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Get products
curl http://localhost:3000/api/products

# Get categories
curl http://localhost:3000/api/categories
```

## Database Management

### View Database
```bash
npm run db:studio
```

### Reset Database
```bash
npx prisma migrate reset
npm run db:seed
```

### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Deploy Migrations
```bash
npx prisma migrate deploy
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Database Connection Issues
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings
- Verify credentials

### Stripe Webhook Not Working
- Ensure Stripe CLI is running
- Check webhook secret matches
- Verify endpoint URL is correct

## Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://yourdomain.com"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
# ... all other variables
```

### Database Migrations

```bash
npx prisma migrate deploy
```

### Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Security Checklist

- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure cookie settings
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CSP headers
- [ ] Use Stripe live keys
- [ ] Verify webhook signatures

## Monitoring

### Logs

Check application logs for errors:
```bash
# Vercel
vercel logs

# Railway
railway logs
```

### Database

Monitor database performance:
- Connection pool usage
- Query performance
- Storage usage

### Stripe

Monitor in Stripe Dashboard:
- Payment success rate
- Failed payments
- Webhook delivery

## Backup

### Database Backup

```bash
# Export database
pg_dump -U username -d kloset > backup.sql

# Import database
psql -U username -d kloset < backup.sql
```

### Automated Backups

Most cloud providers offer automated backups:
- Supabase: Automatic daily backups
- Neon: Point-in-time restore
- Railway: Database snapshots

## Performance Optimization

### Database Indexing

Already configured in Prisma schema:
- Product slug index
- Category slug index
- Order status index
- User email index

### Caching

Redis caching is configured for:
- Product listings (5 min TTL)
- Category list (1 hour TTL)
- Featured products (10 min TTL)

### Connection Pooling

Use PgBouncer for connection pooling (included in Supabase)

## Support

For issues:
1. Check logs
2. Review API documentation
3. Test with Prisma Studio
4. Verify environment variables
5. Check external service status

## Next Steps

1. Implement email templates with Resend
2. Add image upload functionality with Cloudinary
3. Set up error monitoring with Sentry
4. Configure analytics
5. Add more admin features
6. Implement product reviews
7. Add advanced search
8. Set up CI/CD pipeline
