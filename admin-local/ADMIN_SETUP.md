# 🔒 Kloset Admin Panel - Local Setup Guide

## ⚠️ CRITICAL SECURITY NOTICE

**THIS ADMIN PANEL RUNS EXCLUSIVELY ON LOCALHOST**
- ❌ NEVER deploy to Vercel, Netlify, Railway, or any cloud service
- ❌ NEVER expose port 4000 to the internet
- ❌ NEVER commit `.env` file to GitHub
- ✅ ONLY accessible from the store owner's local machine
- ✅ Bound to 127.0.0.1 (localhost) ONLY

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Thermal Printer** (USB or Network)
   - Supported: EPSON, STAR, or compatible ESC/POS printers
   - Paper size: 58mm or 80mm thermal paper
3. **Main Kloset store** database accessible

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd admin-local/server
npm install
```

### Step 2: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
```

**Required `.env` configuration:**

```env
# Database (same as main store)
DATABASE_URL="file:../../prisma/dev.db"

# Generate password hash
# Run: npm run hash-password yourpassword
ADMIN_USERNAME=owner
ADMIN_PASSWORD_HASH=$2a$10$...your_bcrypt_hash_here

# Generate JWT secret
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_64_character_hex_string_here

SESSION_EXPIRES=8h

# Printer setup (get name from Step 3)
PRINTER_NAME=YourPrinterNameHere
PRINTER_TYPE=EPSON
PAPER_SIZE=80

PORT=4000
NODE_ENV=development
```

### Step 3: Find Your Printer Name

```bash
# List all detected printers
node -e "const printer = require('node-thermal-printer'); printer.ThermalPrinter.listPrinters().then(console.log)"
```

Copy the exact printer name to `.env` as `PRINTER_NAME`

### Step 4: Generate Password Hash

```bash
# Generate bcrypt hash for your password
npm run hash-password YourSecurePassword123

# Copy the output to ADMIN_PASSWORD_HASH in .env
```

### Step 5: Start Server

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

### Step 6: Install Client (React Admin UI)

```bash
cd ../client
npm install
npm run dev
```

Client will run at: **http://localhost:5173**

## 📁 Project Structure

```
admin-local/
├── server/                    # Express.js backend
│   ├── index.js              # Main server (binds to 127.0.0.1:4000)
│   ├── package.json
│   ├── .env                  # LOCAL ONLY - never commit!
│   ├── .env.example
│   │
│   ├── middleware/
│   │   ├── localOnly.js      # Blocks non-localhost requests
│   │   └── auth.js           # JWT verification
│   │
│   ├── routes/
│   │   ├── auth.js           # Login/logout
│   │   ├── orders.js         # Order management
│   │   ├── printer.js        # Print endpoints
│   │   └── dashboard.js      # Stats/analytics
│   │
│   ├── services/
│   │   ├── printerService.js # Thermal printer logic
│   │   └── orderService.js   # Database queries
│   │
│   └── templates/
│       ├── receipt.js        # Address label template
│       ├── deliverySlip.js   # Delivery slip template
│       └── orderSummary.js   # Full order summary
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderDetail.jsx
    │   │   └── Settings.jsx
    │   │
    │   ├── components/
    │   │   ├── OrderTable.jsx
    │   │   ├── PrintButton.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── PrinterStatus.jsx
    │   │
    │   └── App.jsx
    │
    ├── package.json
    └── vite.config.js
```

## 🔐 Security Features

### 1. Localhost-Only Access
- Server binds to `127.0.0.1` (NOT `0.0.0.0`)
- `localOnly` middleware blocks all non-localhost IPs
- Logs all blocked access attempts

### 2. Authentication
- JWT-based authentication
- Credentials stored as bcrypt hash in `.env`
- 8-hour session expiry
- Brute force protection (5 attempts, 15-min lockout)

### 3. Firewall Rules (Optional but Recommended)

**Windows:**
```powershell
netsh advfirewall firewall add rule name="Block Admin Port 4000" protocol=TCP dir=in localport=4000 action=block remoteip=!127.0.0.1
```

**Mac/Linux:**
```bash
sudo ufw deny 4000
sudo ufw allow from 127.0.0.1 to any port 4000
```

## 🖨️ Printer Setup

### Supported Printers
- EPSON TM series (TM-T20, TM-T88, etc.)
- STAR TSP series
- Any ESC/POS compatible thermal printer

### Connection Methods

**USB Connection:**
1. Install printer driver from manufacturer
2. Connect printer via USB
3. Printer will appear in system printers
4. Use exact printer name in `.env`

**Network Connection:**
1. Connect printer to same WiFi as your PC
2. Note printer's IP address
3. In `.env`, use: `PRINTER_NAME=tcp://192.168.1.100`

### Test Printing

```bash
# Test if printer is connected
curl http://127.0.0.1:4000/api/printer/status

# Print test page
curl -X POST http://127.0.0.1:4000/api/printer/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Features

### Dashboard
- New orders today
- Pending orders count
- Total revenue
- Live order feed (updates every 30 seconds)
- Quick print all pending orders

### Order Management
- Real-time order list from production database
- Filter by status, date range, customer name
- Bulk select and print
- One-click print per order
- Status updates with customer email notification
- Order detail view with full information

### Printing
- **Address Label** (80mm thermal) - shipping label
- **Delivery Slip** (80mm thermal) - packing slip with items
- **Full Summary** (A4 PDF) - complete invoice for records
- Auto-print on new orders
- Desktop notifications for new orders

### Settings
- Select default printer
- Paper size configuration
- Test print
- Printer connection status

## 🔄 Auto-Print Feature

The server automatically:
1. Polls database every 30 seconds for new orders
2. Shows desktop notification when new order arrives
3. Auto-prints delivery slip to configured printer
4. Logs all print actions

To disable auto-print, comment out the cron job in `server/index.js`

## 🚀 Startup Scripts

### Windows (start.bat)

Create `admin-local/start.bat`:

```batch
@echo off
echo Starting Kloset Admin Panel...
cd /d %~dp0
start cmd /k "cd server && npm run dev"
timeout /t 3
start cmd /k "cd client && npm run dev"
timeout /t 5
start http://localhost:5173
echo Admin Panel is running!
```

### Mac/Linux (start.sh)

Create `admin-local/start.sh`:

```bash
#!/bin/bash
echo "Starting Kloset Admin Panel..."
cd "$(dirname "$0")"
cd server && npm run dev &
cd ../client && npm run dev &
sleep 5
open http://localhost:5173  # Mac
# xdg-open http://localhost:5173  # Linux
```

Make executable: `chmod +x start.sh`

## 📝 Usage

### Login
1. Open http://localhost:5173
2. Enter username and password (from `.env`)
3. JWT token stored in localStorage
4. Auto-logout after 8 hours

### View Orders
1. Click "Orders" in sidebar
2. See all orders from production database
3. Filter by status or search
4. Click order to see details

### Print Order
1. Click print icon next to order
2. Choose: Address Label | Delivery Slip | Full Summary
3. Print immediately to configured printer

### Update Order Status
1. Open order detail
2. Select new status from dropdown
3. Customer receives email notification automatically

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000  # Windows
lsof -i :4000                 # Mac/Linux

# Kill process if needed
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### Printer not found
```bash
# List printers
node -e "require('node-thermal-printer').ThermalPrinter.listPrinters().then(console.log)"

# Check printer is powered on and connected
# Verify printer name matches exactly in .env
```

### Database connection error
```bash
# Verify DATABASE_URL in .env points to correct database
# Check main store database is accessible
# Run: npx prisma studio (from main store directory)
```

### Login fails
```bash
# Verify password hash is correct
npm run hash-password YourPassword

# Check JWT_SECRET is set in .env
# Clear browser localStorage and try again
```

## 📦 Production Deployment

**⚠️ IMPORTANT: This admin panel should NEVER be deployed to production servers!**

This is a **local-only** tool for the store owner's machine.

If you need remote admin access:
1. Use VPN to connect to store owner's network
2. Or build a separate cloud-based admin (with proper authentication)
3. Or use SSH tunnel: `ssh -L 4000:localhost:4000 user@store-server`

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Server binds to `127.0.0.1` only
- [ ] `localOnly` middleware is first middleware
- [ ] Strong password used (12+ characters)
- [ ] JWT secret is random 32+ bytes
- [ ] Firewall rules configured (optional)
- [ ] Auto-logout after 8 hours enabled
- [ ] Brute force protection active
- [ ] All print actions logged

## 📞 Support

For issues:
1. Check this setup guide
2. Review server logs
3. Test printer connection
4. Verify database access

## ✅ Quick Test

After setup, verify everything works:

```bash
# 1. Server health check
curl http://127.0.0.1:4000/api/health

# 2. Login (replace credentials)
curl -X POST http://127.0.0.1:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"yourpassword"}'

# 3. Check printer status (use token from step 2)
curl http://127.0.0.1:4000/api/printer/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎉 You're Ready!

Your local admin panel is now set up and ready to manage orders!

**Access:** http://localhost:5173
**API:** http://127.0.0.1:4000

Happy order management! 📦
