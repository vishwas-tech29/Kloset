require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const notifier = require('node-notifier');
const path = require('path');

// Import middleware
const localOnly = require('./middleware/localOnly');
const authMiddleware = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const printerRoutes = require('./routes/printer');
const dashboardRoutes = require('./routes/dashboard');

// Import services
const { printDeliverySlip } = require('./services/printerService');
const { getNewOrders } = require('./services/orderService');

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================================
// CRITICAL SECURITY: Apply localhost-only middleware FIRST
// ============================================================================
app.use(localOnly);

// ============================================================================
// Basic Middleware
// ============================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - only allow localhost origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Routes
// ============================================================================

// Public routes (no auth required)
app.use('/api/auth', authRoutes);

// Protected routes (auth required)
app.use('/api/orders', authMiddleware, ordersRoutes);
app.use('/api/printer', authMiddleware, printerRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Admin server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Kloset Admin API',
    version: '1.0.0',
    access: 'localhost-only'
  });
});

// ============================================================================
// Auto-Print New Orders (Polling every 30 seconds)
// ============================================================================
let lastChecked = new Date();

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const newOrders = await getNewOrders(lastChecked);
      
      for (const order of newOrders) {
        // Desktop notification
        notifier.notify({
          title: '🛍️ New Order Received!',
          message: `Order #${order.id.slice(-8).toUpperCase()} - $${order.total}`,
          sound: true,
          wait: false
        });

        // Auto print delivery slip
        try {
          await printDeliverySlip(order);
          console.log(`✅ Auto-printed delivery slip for order: ${order.id}`);
        } catch (printError) {
          console.error(`❌ Failed to auto-print order ${order.id}:`, printError.message);
        }
      }

      if (newOrders.length > 0) {
        lastChecked = new Date();
      }
    } catch (error) {
      console.error('Error checking for new orders:', error);
    }
  });

  console.log('📋 Auto-print service started (checking every 30 seconds)');
}

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// Start Server - BIND TO 127.0.0.1 ONLY (NOT 0.0.0.0)
// ============================================================================
app.listen(PORT, '127.0.0.1', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔒 KLOSET ADMIN SERVER - LOCALHOST ONLY');
  console.log('='.repeat(60));
  console.log(`✅ Server running at: http://127.0.0.1:${PORT}`);
  console.log(`🔐 Access restricted to: LOCALHOST ONLY`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(60) + '\n');
  
  console.warn('⚠️  SECURITY WARNING:');
  console.warn('   This server is bound to 127.0.0.1 and will REJECT');
  console.warn('   all requests from non-localhost IP addresses.');
  console.warn('   DO NOT deploy this to any cloud service!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
