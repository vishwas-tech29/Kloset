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
