const jwt = require('jsonwebtoken');

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'vintage-dago-shop-secret-key-change-in-production';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user info to req.user if valid
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'No token provided'
    });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
    }

    // Attach user info to request
    req.user = user;
    next();
  });
};

/**
 * Generate JWT token for a user
 * @param {Object} user - User object with id, email, role
 * @param {string} expiresIn - Token expiration (default: 24h)
 * @returns {string} JWT token
 */
const generateToken = (user, expiresIn = '24h') => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user'
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
