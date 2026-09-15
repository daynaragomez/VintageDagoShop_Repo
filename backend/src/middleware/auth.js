const jwt = require('jsonwebtoken');

// JWT secret - require it from environment in CI/production. For local development, a warning is logged
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Do not crash here to preserve developer experience, but log a visible warning so it is not missed
  // CI / production should always set JWT_SECRET to a strong value
  // WARNING: using the app without JWT_SECRET in production is insecure
  // Set JWT_SECRET in your environment or .env for local development
  // Example: JWT_SECRET="your-strong-secret"
  // This file intentionally does not provide a hardcoded fallback.
  // eslint-disable-next-line no-console
  console.warn('WARNING: JWT_SECRET is not set. Using the app without a secure JWT secret is insecure. Set JWT_SECRET in environment.');
}

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

// requireRole accepts a single role string or an array of allowed roles
const requireRole = (roleOrRoles) => (req, res, next) => {
  const userRole = req.user && req.user.role;
  if (!userRole) {
    return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
  }

  const allowedRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
  }

  next();
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

  return jwt.sign(payload, JWT_SECRET || '', { expiresIn });
};

module.exports = {
  authenticateToken,
  requireRole,
  generateToken,
  JWT_SECRET
};
