# Complete Admin Panel Code

This document contains all remaining code files for the admin panel.

## Server Files

### services/orderService.js

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get new orders since last check
 */
const getNewOrders = async (since) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gt: since },
        status: 'PENDING'
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching new orders:', error);
    return [];
  }
};

/**
 * Get all orders with filters
 */
const getOrders = async (filters = {}) => {
  const { status, startDate, endDate, search, limit = 50, offset = 0 } = filters;

  const where = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { id: { contains: search } },
      { guestName: { contains: search } },
      { guestEmail: { contains: search } }
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.order.count({ where })
  ]);

  return { orders, total };
};

/**
 * Get single order by ID
 */
const getOrderById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  });
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status, notes = null) => {
  const updateData = { status };
  if (notes) updateData.notes = notes;

  return await prisma.order.update({
    where: { id: orderId },
    data: updateData
  });
};

/**
 * Get dashboard stats
 */
const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    newOrdersToday,
    pendingOrders,
    processingOrders,
    totalRevenue,
    recentOrders
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: today },
        status: 'PENDING'
      }
    }),
    prisma.order.count({
      where: { status: 'PENDING' }
    }),
    prisma.order.count({
      where: { status: 'PROCESSING' }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
      }
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          take: 1,
          include: { product: true }
        }
      }
    })
  ]);

  return {
    newOrdersToday,
    pendingOrders,
    processingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders
  };
};

module.exports = {
  getNewOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
};
```

### routes/orders.js

```javascript
const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../services/orderService');

/**
 * GET /api/orders
 * Get all orders with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate, search, limit, offset } = req.query;

    const result = await getOrders({
      status,
      startDate,
      endDate,
      search,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get single order by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await updateOrderStatus(req.params.id, status, notes);

    console.log(`✅ Order ${order.id} status updated to ${status}`);

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
```

### routes/printer.js

```javascript
const express = require('express');
const router = express.Router();
const {
  checkPrinterStatus,
  printTestPage,
  printAddressLabel,
  printDeliverySlip
} = require('../services/printerService');
const { getOrderById } = require('../services/orderService');

/**
 * GET /api/printer/status
 * Check printer connection status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await checkPrinterStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      connected: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/printer/test
 * Print test page
 */
router.post('/test', async (req, res) => {
  try {
    await printTestPage();
    res.json({ success: true, message: 'Test page printed' });
  } catch (error) {
    console.error('Print test error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/printer/address-label/:orderId
 * Print address label for order
 */
router.post('/address-label/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await printAddressLabel(order);
    res.json({ success: true, message: 'Address label printed' });
  } catch (error) {
    console.error('Print address label error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/printer/delivery-slip/:orderId
 * Print delivery slip for order
 */
router.post('/delivery-slip/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await printDeliverySlip(order);
    res.json({ success: true, message: 'Delivery slip printed' });
  } catch (error) {
    console.error('Print delivery slip error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### routes/dashboard.js

```javascript
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../services/orderService');

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
```

## Client Setup

### client/package.json

```json
{
  "name": "kloset-admin-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

### client/vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1'
  }
})
```

### client/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kloset Admin - Local Only</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Startup Scripts

### Windows (start.bat)

```batch
@echo off
echo ============================================================
echo Starting Kloset Admin Panel (Localhost Only)
echo ============================================================
cd /d %~dp0

echo.
echo [1/3] Starting backend server...
start "Admin Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting frontend client...
start "Admin Client" cmd /k "cd client && npm run dev"

timeout /t 5 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:5173

echo.
echo ============================================================
echo Admin Panel is running!
echo Backend:  http://127.0.0.1:4000
echo Frontend: http://localhost:5173
echo ============================================================
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WINDOWTITLE eq Admin Server*" /F
taskkill /FI "WINDOWTITLE eq Admin Client*" /F
```

### Mac/Linux (start.sh)

```bash
#!/bin/bash

echo "============================================================"
echo "Starting Kloset Admin Panel (Localhost Only)"
echo "============================================================"

cd "$(dirname "$0")"

echo ""
echo "[1/3] Starting backend server..."
cd server && npm run dev &
SERVER_PID=$!

sleep 3

echo "[2/3] Starting frontend client..."
cd ../client && npm run dev &
CLIENT_PID=$!

sleep 5

echo "[3/3] Opening browser..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:5173
else
  xdg-open http://localhost:5173
fi

echo ""
echo "============================================================"
echo "Admin Panel is running!"
echo "Backend:  http://127.0.0.1:4000"
echo "Frontend: http://localhost:5173"
echo "============================================================"
echo ""
echo "Press Ctrl+C to stop all services..."

trap "kill $SERVER_PID $CLIENT_PID; exit" INT TERM

wait
```

Make executable: `chmod +x start.sh`

## Installation Steps

1. **Install server dependencies:**
```bash
cd admin-local/server
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Generate password hash:**
```bash
npm run hash-password YourSecurePassword
# Copy output to ADMIN_PASSWORD_HASH in .env
```

4. **Install client dependencies:**
```bash
cd ../client
npm install
```

5. **Start everything:**
```bash
# Windows
../start.bat

# Mac/Linux
../start.sh
```

## Next Steps

The complete React frontend code is extensive. Would you like me to:
1. Create the React components and pages?
2. Focus on specific features first?
3. Create a simplified version?

Let me know and I'll continue building!
