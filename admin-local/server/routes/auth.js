const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Brute force protection
const loginAttempts = new Map();
const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCKOUT_DURATION = parseInt(process.env.LOCKOUT_DURATION) || 900000; // 15 minutes

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Username and password are required' 
      });
    }

    // Check for brute force attempts
    const clientIP = req.ip || req.connection.remoteAddress;
    const attempts = loginAttempts.get(clientIP) || { count: 0, lockedUntil: null };

    // Check if account is locked
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Account locked. Try again in ${remainingTime} minutes.`,
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Reset lock if duration has passed
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      attempts.count = 0;
      attempts.lockedUntil = null;
    }

    // Verify username (from environment variable)
    if (username !== process.env.ADMIN_USERNAME) {
      // Increment failed attempts
      attempts.count++;
      loginAttempts.set(clientIP, attempts);

      // Log failed attempt
      console.warn(`❌ Failed login attempt for username: ${username} from IP: ${clientIP}`);

      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid credentials' 
      });
    }

    // Verify password (compare with bcrypt hash from environment)
    const isValidPassword = await bcrypt.compare(
      password, 
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!isValidPassword) {
      // Increment failed attempts
      attempts.count++;
      
      // Lock account if max attempts reached
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
        console.warn(`🔒 Account locked for IP: ${clientIP} after ${MAX_ATTEMPTS} failed attempts`);
      }

      loginAttempts.set(clientIP, attempts);

      // Log failed attempt
      console.warn(`❌ Failed login attempt for user: ${username} from IP: ${clientIP} (Attempt ${attempts.count}/${MAX_ATTEMPTS})`);

      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid credentials',
        attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attempts.count)
      });
    }

    // Successful login - reset attempts
    loginAttempts.delete(clientIP);

    // Generate JWT token
    const token = jwt.sign(
      { 
        username, 
        role: 'owner',
        loginTime: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_EXPIRES || '8h' }
    );

    // Log successful login
    console.log(`✅ Successful login for user: ${username} from IP: ${clientIP}`);

    res.json({ 
      success: true,
      token,
      user: {
        username,
        role: 'owner'
      },
      expiresIn: process.env.SESSION_EXPIRES || '8h'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Login failed' 
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify if token is still valid
 */
router.post('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ 
      valid: true,
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    res.json({ valid: false });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', (req, res) => {
  // JWT is stateless, so logout is handled client-side by removing the token
  // We just log the event here
  console.log(`👋 User logged out from IP: ${req.ip || req.connection.remoteAddress}`);
  
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

module.exports = router;
