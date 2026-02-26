const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');
const fs = require('fs');
const path = require('path');

/**
 * Initialize thermal printer with configuration from environment
 */
const initPrinter = () => {
  const printerType = process.env.PRINTER_TYPE === 'STAR' ? PrinterTypes.STAR : PrinterTypes.EPSON;
  
  return new ThermalPrinter({
    type: printerType,
    interface: `printer:${process.env.PRINTER_NAME}`,
    characterSet: 'PC437_USA',
    removeSpecialCharacters: false,
    lineCharacter: '-',
    options: {
      timeout: 5000,
    }
  });
};

/**
 * Check if printer is connected and ready
 */
const checkPrinterStatus = async () => {
  try {
    const printer = initPrinter();
    const isConnected = await printer.isPrinterConnected();
    
    return {
      connected: isConnected,
      name: process.env.PRINTER_NAME,
      type: process.env.PRINTER_TYPE,
      paperSize: `${process.env.PAPER_SIZE}mm`
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

/**
 * Print test page
 */
const printTestPage = async () => {
  const printer = initPrinter();
  
  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer not connected');
    }

    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('KLOSET ADMIN');
    printer.bold(false);
    printer.setTextNormal();
    printer.println('Test Print');
    printer.drawLine();
    printer.alignLeft();
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.println(`Printer: ${process.env.PRINTER_NAME}`);
    printer.println(`Type: ${process.env.PRINTER_TYPE}`);
    printer.println(`Paper: ${process.env.PAPER_SIZE}mm`);
    printer.newLine();
    printer.alignCenter();
    printer.println('✓ Printer is working correctly!');
    printer.newLine();
    printer.cut();
    
    await printer.execute();
    await printer.clear();
    
    logPrintAction('TEST_PAGE', null, 'success');
    return { success: true };
  } catch (error) {
    logPrintAction('TEST_PAGE', null, 'failed', error.message);
    throw error;
  }
};

/**
 * Print address label (shipping label)
 * Fits 80mm thermal paper
 */
const printAddressLabel = async (order) => {
  const printer = initPrinter();
  
  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer not connected');
    }

    // Parse shipping address if it's a JSON string
    const address = typeof order.shippingAddress === 'string' 
      ? JSON.parse(order.shippingAddress) 
      : order.shippingAddress;

    // Header
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('SHIP TO:');
    printer.bold(false);
    printer.setTextNormal();
    printer.newLine();

    // Recipient details
    printer.alignLeft();
    printer.setTextDoubleHeight();
    printer.println(address.fullName || `${address.firstName} ${address.lastName}`);
    printer.setTextNormal();
    printer.println(address.addressLine1 || address.street);
    if (address.addressLine2) {
      printer.println(address.addressLine2);
    }
    printer.println(`${address.city}, ${address.state} ${address.postalCode || address.zipCode}`);
    printer.println(address.country);
    
    if (address.phone) {
      printer.println(`Phone: ${address.phone}`);
    }

    printer.newLine();
    printer.drawLine();

    // Order info
    printer.alignCenter();
    printer.println(`Order #${order.id.slice(-8).toUpperCase()}`);
    printer.println(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    
    // Barcode
    try {
      printer.printBarcode(order.id.slice(-12), 73); // Code128
    } catch (e) {
      // Barcode might not be supported on all printers
      printer.println(`ID: ${order.id.slice(-12)}`);
    }

    printer.newLine();
    printer.cut();

    await printer.execute();
    await printer.clear();

    logPrintAction('ADDRESS_LABEL', order.id, 'success');
    console.log(`✅ Address label printed for order: ${order.id}`);
    
    return { success: true };
  } catch (error) {
    logPrintAction('ADDRESS_LABEL', order.id, 'failed', error.message);
    throw error;
  }
};

/**
 * Print delivery slip (packing slip with items)
 * Fits 80mm thermal paper
 */
const printDeliverySlip = async (order) => {
  const printer = initPrinter();
  
  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer not connected');
    }

    // Parse shipping address if it's a JSON string
    const address = typeof order.shippingAddress === 'string' 
      ? JSON.parse(order.shippingAddress) 
      : order.shippingAddress;

    // Header
    printer.alignCenter();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println('KLOSET');
    printer.setTextNormal();
    printer.bold(false);
    printer.println('Thank you for your order!');
    printer.drawLine();

    // Order info
    printer.alignLeft();
    printer.println(`Order ID: #${order.id.slice(-8).toUpperCase()}`);
    printer.println(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    printer.println(`Customer: ${order.guestName}`);
    printer.println(`Email: ${order.guestEmail}`);
    printer.newLine();

    // Items list
    printer.bold(true);
    printer.println('ITEMS ORDERED:');
    printer.bold(false);
    printer.drawLine();

    for (const item of order.items) {
      printer.println(item.name);
      
      // Check if variant info exists
      if (item.variant) {
        printer.println(`  Size: ${item.variant.size} | Color: ${item.variant.color}`);
      }
      
      const itemTotal = (item.quantity * parseFloat(item.price)).toFixed(2);
      printer.println(`  Qty: ${item.quantity} x $${parseFloat(item.price).toFixed(2)} = $${itemTotal}`);
      printer.drawLine();
    }

    printer.newLine();

    // Totals
    printer.println(`Subtotal:     $${parseFloat(order.subtotal).toFixed(2)}`);
    printer.println(`Shipping:     $${parseFloat(order.shippingCost).toFixed(2)}`);
    
    if (parseFloat(order.discount) > 0) {
      printer.println(`Discount:    -$${parseFloat(order.discount).toFixed(2)}`);
    }
    
    printer.println(`Tax:          $${parseFloat(order.tax).toFixed(2)}`);
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println(`TOTAL:        $${parseFloat(order.total).toFixed(2)}`);
    printer.setTextNormal();
    printer.bold(false);
    printer.newLine();

    // Shipping address
    printer.drawLine();
    printer.bold(true);
    printer.println('DELIVER TO:');
    printer.bold(false);
    printer.println(address.fullName || `${address.firstName} ${address.lastName}`);
    printer.println(address.addressLine1 || address.street);
    if (address.addressLine2) {
      printer.println(address.addressLine2);
    }
    printer.println(`${address.city}, ${address.state} ${address.postalCode || address.zipCode}`);
    printer.println(address.country);
    printer.newLine();

    // Footer
    printer.alignCenter();
    printer.println('Questions? Email: support@kloset.com');
    printer.newLine();
    printer.cut();

    await printer.execute();
    await printer.clear();

    logPrintAction('DELIVERY_SLIP', order.id, 'success');
    console.log(`✅ Delivery slip printed for order: ${order.id}`);
    
    return { success: true };
  } catch (error) {
    logPrintAction('DELIVERY_SLIP', order.id, 'failed', error.message);
    throw error;
  }
};

/**
 * Log print actions to file
 */
const logPrintAction = (type, orderId, status, error = null) => {
  const logDir = path.join(__dirname, '../logs');
  const logFile = path.join(logDir, 'print-log.txt');

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    orderId,
    status,
    error
  };

  const logLine = `${JSON.stringify(logEntry)}\n`;

  fs.appendFileSync(logFile, logLine);
};

module.exports = {
  checkPrinterStatus,
  printTestPage,
  printAddressLabel,
  printDeliverySlip
};
