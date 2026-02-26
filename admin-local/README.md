# 🔒 Kloset Admin Panel - Localhost Only

## ⚡ Quick Start (2 Steps)

### Step 1: Stop Main Dev Server & Generate Prisma Client

```bash
# 1. Stop the main store dev server (Ctrl+C)

# 2. Generate Prisma client for admin
cd admin-local/server
npx prisma generate --schema=../../prisma/schema.prisma
```

### Step 2: Start Admin Server

```bash
npm run dev
```

Server will start at: **http://127.0.0.1:4000**

## 🎯 Access Admin Panel

Open the HTML admin interface:

**File:** `admin-local/admin.html`

Just double-click the file or open it in your browser!

**Login Credentials:**
- Username: `owner`
- Password: `admin123`

## ✅ What's Working

- ✅ Localhost-only Express server (port 4000)
- ✅ JWT authentication with brute force protection
- ✅ Order management API
- ✅ Dashboard statistics
- ✅ Printer service (when printer connected)
- ✅ Simple HTML admin interface

## 📊 Features

### Dashboard
- New orders today count
- Pending orders count
- Processing orders count
- Total revenue
- Recent orders list
- Auto-refresh every 30 seconds

### Security
- Localhost-only access (127.0.0.1)
- JWT authentication
- 8-hour session expiry
- Brute force protection (5 attempts, 15-min lockout)
- All requests logged

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Protected Endpoints (require JWT token)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/printer/status` - Check printer status
- `POST /api/printer/test` - Print test page
- `POST /api/printer/address-label/:orderId` - Print address label
- `POST /api/printer/delivery-slip/:orderId` - Print delivery slip

## 🖨️ Printer Setup (Optional)

If you have a thermal printer:

1. Connect printer (USB or Network)
2. Find printer name:
   ```bash
   node -e "require('node-thermal-printer').ThermalPrinter.listPrinters().then(console.log)"
   ```
3. Update `.env`:
   ```env
   PRINTER_NAME=YourPrinterNameHere
   PRINTER_TYPE=EPSON
   PAPER_SIZE=80
   ```

## 📝 Testing with curl

### Login
```bash
curl -X POST http://127.0.0.1:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"admin123"}'
```

### Get Dashboard Stats
```bash
curl http://127.0.0.1:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Orders
```bash
curl http://127.0.0.1:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### Server won't start
**Error:** "Prisma client not initialized"

**Solution:**
```bash
# Stop main dev server first
# Then:
cd admin-local/server
npx prisma generate --schema=../../prisma/schema.prisma
npm run dev
```

### Can't connect from browser
**Error:** "Cannot connect to server"

**Check:**
1. Is server running? Look for "Server running at http://127.0.0.1:4000"
2. Is it on port 4000? Check `.env` PORT setting
3. Try: `curl http://127.0.0.1:4000/api/health`

### Login fails
**Error:** "Invalid credentials"

**Check:**
1. Username is `owner` (from `.env`)
2. Password is `admin123` (default hash in `.env`)
3. To change password:
   ```bash
   npm run hash-password YourNewPassword
   # Copy output to ADMIN_PASSWORD_HASH in .env
   ```

## 📁 File Structure

```
admin-local/
├── admin.html              # Simple HTML admin interface
├── README.md               # This file
├── ADMIN_SETUP.md          # Detailed setup guide
├── QUICK_START.md          # Quick reference
└── server/
    ├── index.js            # Main server (binds to 127.0.0.1:4000)
    ├── package.json
    ├── .env                # Configuration
    ├── middleware/
    │   ├── localOnly.js    # Blocks non-localhost
    │   └── auth.js         # JWT verification
    ├── routes/
    │   ├── auth.js         # Login/logout
    │   ├── orders.js       # Order management
    │   ├── printer.js      # Printing
    │   └── dashboard.js    # Stats
    └── services/
        ├── printerService.js  # Thermal printer
        └── orderService.js    # Database queries
```

## 🔐 Security Features

1. **Localhost Only** - Server binds to 127.0.0.1, not 0.0.0.0
2. **IP Filtering** - Middleware blocks all non-localhost IPs
3. **JWT Auth** - Secure token-based authentication
4. **Brute Force Protection** - 5 attempts, 15-minute lockout
5. **Session Expiry** - Auto-logout after 8 hours
6. **Request Logging** - All access attempts logged

## ⚠️ Important Security Notes

- ❌ **NEVER** deploy this to cloud (Vercel, Netlify, etc.)
- ❌ **NEVER** expose port 4000 to internet
- ❌ **NEVER** commit `.env` file to GitHub
- ✅ **ONLY** run on store owner's local machine
- ✅ **ALWAYS** keep server bound to 127.0.0.1

## 🚀 Next Steps

1. ✅ Start server
2. ✅ Open `admin.html` in browser
3. ✅ Login with owner/admin123
4. ✅ View dashboard and orders
5. ⏳ Set up thermal printer (optional)
6. ⏳ Build React frontend (optional)

## 📞 Support

Check these files for more info:
- `ADMIN_SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - Quick reference guide
- `COMPLETE_CODE.md` - All code examples

## ✨ Features Coming Soon

- React frontend with better UI
- Order detail view
- Status update interface
- Print preview
- Settings page
- Bulk operations

Your admin backend is ready to use! 🎉
