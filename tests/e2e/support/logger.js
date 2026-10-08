/**
 * Logger - Structured Logging Utility
 * 
 * Provides:
 * - Structured logging with timestamps
 * - Request/response logging hooks
 * - Multiple log levels (debug, info, warn, error)
 * - Environment-aware log levels
 * - Color-coded console output
 * 
 * Usage:
 *   const logger = new Logger('HomePageTests');
 *   logger.info('User opened shop');
 *   logger.debug('Clicking add to cart button', { productId: 1 });
 *   logger.error('Failed to load products', error);
 */

class Logger {
  constructor(namespace, options = {}) {
    this.namespace = namespace;
    this.level = options.level || process.env.LOG_LEVEL || 'info';
    this.environment = process.env.NODE_ENV || 'test';
    this.showTimestamp = options.showTimestamp !== false;
  }

  // Log levels with priority (higher = more important)
  static LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
  };

  // ANSI color codes for terminal output
  static COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
  };

  /**
   * Check if message should be logged based on level
   */
  _shouldLog(logLevel) {
    return Logger.LEVELS[logLevel] >= Logger.LEVELS[this.level];
  }

  /**
   * Format timestamp
   */
  _getTimestamp() {
    if (!this.showTimestamp) return '';
    const now = new Date().toISOString();
    return `${Logger.COLORS.dim}${now}${Logger.COLORS.reset} `;
  }

  /**
   * Format log message
   */
  _format(level, message, data, color) {
    const timestamp = this._getTimestamp();
    const namespace = `${Logger.COLORS.bright}${Logger.COLORS.blue}[${this.namespace}]${Logger.COLORS.reset}`;
    const levelLabel = `${color}${level.toUpperCase()}${Logger.COLORS.reset}`;
    
    let output = `${timestamp}${namespace} ${levelLabel} ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      output += ` ${Logger.COLORS.dim}${JSON.stringify(data)}${Logger.COLORS.reset}`;
    }
    
    return output;
  }

  /**
   * Debug level - detailed information for diagnostics
   */
  debug(message, data = {}) {
    if (this._shouldLog('debug')) {
      console.debug(this._format('debug', message, data, Logger.COLORS.gray));
    }
  }

  /**
   * Info level - general informational messages
   */
  info(message, data = {}) {
    if (this._shouldLog('info')) {
      console.log(this._format('info', message, data, Logger.COLORS.cyan));
    }
  }

  /**
   * Warn level - warning messages
   */
  warn(message, data = {}) {
    if (this._shouldLog('warn')) {
      console.warn(this._format('warn', message, data, Logger.COLORS.yellow));
    }
  }

  /**
   * Error level - error messages
   */
  error(message, error = null) {
    if (this._shouldLog('error')) {
      const data = error ? { error: error.message, stack: error.stack } : {};
      console.error(this._format('error', message, data, Logger.COLORS.red));
    }
  }

  /**
   * Fatal level - critical failures
   */
  fatal(message, error = null) {
    const data = error ? { error: error.message, stack: error.stack } : {};
    console.error(this._format('fatal', message, data, Logger.COLORS.red));
  }

  /**
   * Log API request
   */
  logRequest(method, url, data = null) {
    const message = `${method.toUpperCase()} ${url}`;
    const logData = data ? { body: data } : {};
    this.debug(message, logData);
  }

  /**
   * Log API response
   */
  logResponse(method, url, status, duration) {
    const statusColor = status >= 400 ? Logger.COLORS.red : Logger.COLORS.green;
    const message = `${method.toUpperCase()} ${url} ${statusColor}${status}${Logger.COLORS.reset} (${duration}ms)`;
    this.info(message);
  }

  /**
   * Log API error
   */
  logRequestError(method, url, error, duration) {
    const message = `${method.toUpperCase()} ${url} failed after ${duration}ms`;
    this.error(message, error);
  }

  /**
   * Log user action
   */
  logAction(action, details = {}) {
    this.info(`👤 ${action}`, details);
  }

  /**
   * Log assertion
   */
  logAssertion(assertion, expected, actual) {
    this.debug(`✓ Assert: ${assertion}`, { expected, actual });
  }

  /**
   * Log database operation
   */
  logDatabase(operation, table, details = {}) {
    this.debug(`💾 ${operation} ${table}`, details);
  }

  /**
   * Create child logger with additional context
   */
  createChild(childNamespace) {
    return new Logger(`${this.namespace}:${childNamespace}`, {
      level: this.level,
      showTimestamp: this.showTimestamp
    });
  }
}

module.exports = Logger;
