# Quick Start Guide - Fix HTTP 500 Error

## The HTTP 500 error is likely because the database isn't set up. Follow these steps:

## Option 1: Quick Start WITHOUT Database (Recommended for Testing)

If you just want to see the frontend working without backend functionality:

1. **Comment out database-dependent code temporarily**

The site will work for browsing, but login/cart won't persist.

## Option 2: Full Setup WITH Database (Recommended for Full Functionality)

### Step 1: Check if Prisma Client is generated

```bash
npx prisma generate
```

### Step 2: Set up a database

Choose ONE of these options:

#### A. Use SQLite (Easiest - Local File Database)

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env.local`:
```env
DATABASE_URL="file:./dev.db"
```

3. Push schema to database:
```bash
npx prisma db push
```

4. Seed the database:
```bash
npm run db:seed
```

#### B. Use Supabase (Free Cloud PostgreSQL)

1. Go to https://supabase.com
2. Create a new project
3. Get your connection string from Settings → Database
4. Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

5. Push schema:
```bash
npx prisma db push
```

6. Seed database:
```bash
npm run db:seed
```

#### C. Use Local PostgreSQL

1. Install PostgreSQL locally
2. Create database:
```sql
CREATE DATABASE kloset;
```

3. Update `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kloset"
DIRECT_URL="postgresql://username:password@localhost:5432/kloset"
```

4. Push schema:
```bash
npx prisma db push
```

5. Seed database:
```bash
npm run db:seed
```

### Step 3: Verify Environment Variables

Make sure `.env.local` has at minimum:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Can't reach database server"
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Try using SQLite instead (easier for development)

### Error: "Environment variable not found"
- Make sure `.env.local` exists in root directory
- Restart your dev server after changing .env.local
- Check for typos in variable names

### Error: "Module not found"
```bash
rm -rf node_modules
npm install
```

### Still getting 500 error?

Check the terminal where `npm run dev` is running for the actual error message. Common issues:

1. **Prisma Client not generated**: Run `npx prisma generate`
2. **Database connection failed**: Check DATABASE_URL
3. **Missing dependencies**: Run `npm install`
4. **Port already in use**: Kill process on port 3000

## Quick Test Without Database

If you want to test the frontend immediately without setting up a database:

1. Go to any static page like:
   - `http://localhost:3000` (Homepage)
   - `http://localhost:3000/products` (Products - uses mock data)
   - `http://localhost:3000/cart` (Cart - uses localStorage)

2. These pages should work without database:
   - Homepage ✅
   - Product listing ✅
   - Product detail ✅
   - Cart ✅
   - Checkout form ✅

3. These require database:
   - Login/Register ❌
   - Account pages ❌
   - Admin pages ❌
   - Actual order creation ❌

## Recommended: Use SQLite for Quick Start

This is the fastest way to get everything working:

```bash
# 1. Update schema to use SQLite
# Edit prisma/schema.prisma, change datasource to:
# provider = "sqlite"
# url = "file:./dev.db"

# 2. Generate Prisma Client
npx prisma generate

# 3. Create database
npx prisma db push

# 4. Seed with test data
npm run db:seed

# 5. Start server
npm run dev
```

Now visit `http://localhost:3000` - everything should work!

## Test Credentials (After Seeding)

- **Admin**: admin@kloset.com / admin123
- **Customer**: customer@example.com / customer123

## Need Help?

Check the terminal output where you ran `npm run dev` - it will show the actual error message that's causing the 500 error.
