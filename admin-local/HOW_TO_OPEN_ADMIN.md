# 🔧 How to Open the Admin Panel

## The Problem

You're seeing: "Cannot connect to server. Make sure the admin server is running at http://127.0.0.1:4000"

This happens because browsers block requests from `file://` protocol to `http://localhost` for security reasons.

## ✅ Solution 1: Use Live Server (Recommended)

### If you have VS Code:

1. Install "Live Server" extension (if not already installed)
2. Right-click on `admin-local/admin.html`
3. Select "Open with Live Server"
4. It will open at `http://127.0.0.1:5500/admin-local/admin.html`
5. Login with: owner / admin123

### If you have Python:

```bash
# Navigate to admin-local folder
cd admin-local

# Python 3
python -m http.server 8080

# Open browser to:
# http://localhost:8080/admin.html
```

### If you have Node.js http-server:

```bash
# Install globally (one time)
npm install -g http-server

# Navigate to admin-local folder
cd admin-local

# Start server
http-server -p 8080

# Open browser to:
# http://localhost:8080/admin.html
```

## ✅ Solution 2: Use the API Directly

You can test the admin API using curl or Postman:

### 1. Login

```bash
curl -X POST http://127.0.0.1:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"owner\",\"password\":\"admin123\"}"
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Get Dashboard Stats

```bash
curl http://127.0.0.1:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Orders

```bash
curl http://127.0.0.1:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✅ Solution 3: Build a React Admin (Future)

For a better experience, you can build a React admin panel:

```bash
cd admin-local/client
npm create vite@latest . -- --template react
npm install
npm run dev
```

Then integrate with the API at http://127.0.0.1:4000

## ✅ Solution 4: Disable Browser Security (NOT RECOMMENDED)

**WARNING:** Only for testing, never use for production!

### Chrome:

```bash
# Windows
chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome"

# Mac
open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome"

# Linux
google-chrome --disable-web-security --user-data-dir="/tmp/chrome"
```

Then open `admin-local/admin.html` directly.

## Current Server Status

Check if the admin server is running:

```bash
# Windows
netstat -ano | findstr :4000

# Mac/Linux
lsof -i :4000
```

Test the server:

```bash
curl http://127.0.0.1:4000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Admin server is running",
  "timestamp": "2026-02-26T20:05:24.010Z",
  "environment": "development"
}
```

## Quick Test

Open your browser console (F12) and run:

```javascript
fetch('http://127.0.0.1:4000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If you see CORS error or network error, you need to use one of the solutions above.

## Recommended Setup

1. **For Development:**
   - Use VS Code Live Server extension
   - Open `admin.html` with Live Server
   - Access at http://127.0.0.1:5500/admin-local/admin.html

2. **For Production:**
   - Build a proper React/Vue admin panel
   - Or use API directly with Postman/Insomnia
   - Never expose admin panel to public internet

## Need Help?

The admin server is running correctly at http://127.0.0.1:4000

The issue is just how you're accessing the HTML file. Use Live Server or any local web server to serve the HTML file.

---

**Current Status:**
- ✅ Admin Server: Running at http://127.0.0.1:4000
- ✅ API Health: Working
- ⚠️ HTML Access: Needs local web server (not file://)
