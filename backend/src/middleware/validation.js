const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware to catch and return errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation error',
      details: errors.array().map(e => ({
        field: e.param,
        message: e.msg
      }))
    });
  }
  next();
}

/**
 * Validate login request body
 */
const validateLogin = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Validate POST /api/orders request body
 */
const validateOrderCreation = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or less'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .matches(/^\+?[0-9\s\-()]{7,}$/)
    .withMessage('Must be a valid phone number'),
  body('address.street')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ max: 200 })
    .withMessage('Street address must be 200 characters or less'),
  body('address.city')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City must be 50 characters or less'),
  body('address.state')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage('State must be 50 characters or less'),
  body('address.zipCode')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .matches(/^[A-Za-z0-9\s-]{2,20}$/)
    .withMessage('Must be a valid zip/postal code'),
  body('address.country')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 50 })
    .withMessage('Country must be 50 characters or less'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Must include at least one item'),
  body('items.*.productId')
    .isInt({ min: 1 })
    .withMessage('Each item must have a valid productId'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be between 1 and 1000'),
  body('items.*.unitPrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  handleValidationErrors
];

/**
 * Validate order ID parameter
 */
const validateOrderId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Order ID must be a positive integer'),
  handleValidationErrors
];

/**
 * Validate PATCH /api/orders/:id/status request body
 */
const validateOrderStatus = [
  body('status')
    .trim()
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Status must be one of: pending, confirmed, shipped, delivered, cancelled'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateOrderCreation,
  validateOrderId,
  validateOrderStatus
};
