/**
 * CRITICAL SECURITY MIDDLEWARE
 * Blocks ALL requests that don't originate from localhost
 * This ensures the admin panel is ONLY accessible from the owner's machine
 */

const localOnly = (req, res, next) => {
  // Get the real IP address
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Allowed localhost IPs
  const allowedIPs = [
    '127.0.0.1',           // IPv4 localhost
    '::1',                 // IPv6 localhost
    '::ffff:127.0.0.1',    // IPv4-mapped IPv6 localhost
    'localhost'
  ];

  // Extract IP from IPv6 format if needed
  const cleanIP = ip ? ip.replace('::ffff:', '') : '';

  // Check if request is from localhost
  const isLocalhost = allowedIPs.includes(ip) || 
                      allowedIPs.includes(cleanIP) ||
                      ip === undefined; // Sometimes undefined in local dev

  if (!isLocalhost) {
    console.warn(`🚨 BLOCKED ACCESS ATTEMPT from IP: ${ip}`);
    console.warn(`   Timestamp: ${new Date().toISOString()}`);
    console.warn(`   Path: ${req.path}`);
    console.warn(`   Method: ${req.method}`);
    
    return res.status(403).json({ 
      error: 'Access Denied',
      message: 'This admin panel is restricted to localhost only.',
      code: 'FORBIDDEN_REMOTE_ACCESS'
    });
  }

  // Log successful localhost access in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Localhost access: ${req.method} ${req.path}`);
  }

  next();
};

module.exports = localOnly;
