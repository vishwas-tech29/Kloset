# Quick Start - Admin Panel

## Current Status

The admin server is set up but needs the main store's dev server to be stopped first to generate Prisma client.

## Steps to Run

### 1. Stop Main Store Dev Server
```bash
# Press Ctrl+C in the terminal running the main store
```

### 2. Generate Prisma Client
```bash
cd admin-local/server
npx prisma generate --schema=../../prisma/schema.prisma
```

### 3. Start Admin Server
```bash
npm run dev
```

The server will start at: **http://127.0.0.1:4000**

## Default Login Credentials

**Username:** `owner`
**Password:** `admin123`

(The password hash in `.env` is for "admin123")

## API Endpoints Available

Once running, you can test these endpoints:

### Health Check
```bash
curl http://127.0.0.1:4000/api/health
```

### Login
```bash
curl -X POST http://127.0.0.1:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"owner\",\"password\":\"admin123\"}"
```

### Get Orders (requires token)
```bash
curl http://127.0.0.1:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Dashboard Stats (requires token)
```bash
curl http://127.0.0.1:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing Without Frontend

You can test the API using:
- **Postman** - Import the endpoints
- **curl** - Use the commands above
- **Browser** - For GET endpoints with token in header

## Next Steps

1. Stop main dev server
2. Generate Prisma client
3. Start admin server
4. Test with curl or Postman
5. Build React frontend (optional)

## Troubleshooting

### "Prisma client not initialized"
- Stop main dev server
- Run: `npx prisma generate --schema=../../prisma/schema.prisma`
- Restart admin server

### "Port 4000 already in use"
- Check if another process is using port 4000
- Kill it or change PORT in `.env`

### "Database not found"
- Verify DATABASE_URL in `.env` points to correct database
- Should be: `file:../../prisma/dev.db`

## Security Notes

- ✅ Server only accepts localhost connections
- ✅ JWT authentication required for protected routes
- ✅ Brute force protection (5 attempts)
- ✅ 8-hour session expiry
- ❌ Never expose port 4000 to internet
- ❌ Never deploy to cloud services

## What's Working

- ✅ Express server with localhost-only access
- ✅ JWT authentication with brute force protection
- ✅ Order management endpoints
- ✅ Dashboard stats endpoint
- ✅ Printer service (when printer connected)
- ✅ Auto-print on new orders (when enabled)

## What's Needed

- Frontend React app (can be built separately)
- Thermal printer setup (optional)
- Test with actual orders

Your admin backend is ready to use!
