# 🚀 START HERE - Admin Panel Setup

## Current Status

✅ Admin server code is ready
✅ HTML admin interface created
⏳ Needs Prisma client generation
⏳ Needs main dev server to be stopped first

## 📋 Complete Setup (3 Steps)

### Step 1: Stop Main Store Dev Server

The main Kloset store dev server is currently running and locking Prisma files.

**Action:** Go to the terminal running `npm run dev` for the main store and press **Ctrl+C**

### Step 2: Generate Prisma Client for Admin

```bash
cd admin-local/server
npx prisma generate --schema=../../prisma/schema.prisma
```

This will generate the Prisma client that the admin server needs to access the database.

### Step 3: Start Admin Server

```bash
npm run dev
```

You should see:
```
============================================================
🔒 KLOSET ADMIN SERVER - LOCALHOST ONLY
============================================================
✅ Server running at: http://127.0.0.1:4000
🔐 Access restricted to: LOCALHOST ONLY
============================================================
```

## 🎯 Access the Admin Panel

### Option 1: HTML Interface (Easiest)

1. Open file: `admin-local/admin.html` in your browser
2. Login with:
   - Username: `owner`
   - Password: `admin123`

### Option 2: API Testing with curl

```bash
# Test health
curl http://127.0.0.1:4000/api/health

# Login
curl -X POST http://127.0.0.1:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"admin123"}'
```

## ✅ What You'll See

### Dashboard
- **New Orders Today:** Count of today's pending orders
- **Pending Orders:** Total pending orders
- **Processing:** Orders being processed
- **Total Revenue:** Sum of completed orders
- **Recent Orders:** Last 10 orders with details

### Features
- Auto-refresh every 30 seconds
- Real-time order data from production database
- Secure JWT authentication
- Localhost-only access

## 🔧 If Something Goes Wrong

### Error: "Prisma client not initialized"
**Solution:** Run Step 2 again (generate Prisma client)

### Error: "Port 4000 already in use"
**Solution:** 
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

### Error: "Cannot connect to server"
**Check:**
1. Is server running? Look for the success message
2. Is it on port 4000?
3. Try: `curl http://127.0.0.1:4000/api/health`

## 📁 Quick File Reference

- `admin.html` - Open this in browser for admin interface
- `server/index.js` - Main server file
- `server/.env` - Configuration (username, password, etc.)
- `README.md` - Full documentation
- `ADMIN_SETUP.md` - Detailed setup guide

## 🔐 Default Credentials

**Username:** `owner`
**Password:** `admin123`

To change password:
```bash
cd server
npm run hash-password YourNewPassword
# Copy the output to ADMIN_PASSWORD_HASH in .env
```

## 🎉 You're Ready!

Once the server is running:
1. Open `admin.html` in your browser
2. Login with owner/admin123
3. View your orders and dashboard stats!

## 📞 Need Help?

Check these files:
- `README.md` - Complete documentation
- `ADMIN_SETUP.md` - Detailed setup
- `QUICK_START.md` - Quick reference
- `COMPLETE_CODE.md` - All code examples

---

**Remember:** This admin panel is **localhost-only** for security. Never deploy it to the cloud!
