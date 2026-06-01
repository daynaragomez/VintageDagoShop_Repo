const logger = require('../utils/logger');

/**
 * Performance metrics collector
 * Tracks API performance and errors
 */
const metrics = {
  requests: {
    total: 0,
    byMethod: {},
    byPath: {},
  },
  errors: {
    total: 0,
    by4xx: 0,
    by5xx: 0,
  },
  responseTimes: {
    sum: 0,
    count: 0,
    min: Infinity,
    max: 0,
    byPath: {},
  },
};

/**
 * Middleware to track request/response metrics
 */
function metricsMiddleware(req, res, next) {
  const startTime = Date.now();
  const path = req.path;

  // Track request
  metrics.requests.total++;
  metrics.requests.byMethod[req.method] = (metrics.requests.byMethod[req.method] || 0) + 1;
  metrics.requests.byPath[path] = (metrics.requests.byPath[path] || 0) + 1;

  // Override res.json and res.status to capture response info
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = function (data) {
    recordResponse(req, res, Date.now() - startTime);
    return originalJson(data);
  };

  res.send = function (data) {
    recordResponse(req, res, Date.now() - startTime);
    return originalSend(data);
  };

  next();
}

/**
 * Record response metrics
 */
function recordResponse(req, res, duration) {
  const path = req.path;
  const statusCode = res.statusCode;

  // Track response time
  metrics.responseTimes.sum += duration;
  metrics.responseTimes.count++;
  metrics.responseTimes.min = Math.min(metrics.responseTimes.min, duration);
  metrics.responseTimes.max = Math.max(metrics.responseTimes.max, duration);

  if (!metrics.responseTimes.byPath[path]) {
    metrics.responseTimes.byPath[path] = {
      sum: 0,
      count: 0,
      avg: 0,
    };
  }

  metrics.responseTimes.byPath[path].sum += duration;
  metrics.responseTimes.byPath[path].count++;
  metrics.responseTimes.byPath[path].avg = Math.round(
    metrics.responseTimes.byPath[path].sum / metrics.responseTimes.byPath[path].count
  );

  // Track errors
  if (statusCode >= 400) {
    metrics.errors.total++;
    if (statusCode < 500) {
      metrics.errors.by4xx++;
    } else {
      metrics.errors.by5xx++;
    }
  }

  // Log slow requests (>500ms)
  if (duration > 500) {
    logger.warn(`Slow request detected: ${req.method} ${path} took ${duration}ms`, {
      method: req.method,
      path,
      duration,
      statusCode,
    });
  }

  // Log errors
  if (statusCode >= 500) {
    logger.error(`Server error: ${req.method} ${path}`, {
      method: req.method,
      path,
      statusCode,
      duration,
    });
  }
}

/**
 * Get current metrics snapshot
 */
function getMetrics() {
  const avgResponseTime = metrics.responseTimes.count > 0
    ? Math.round(metrics.responseTimes.sum / metrics.responseTimes.count)
    : 0;

  const errorRate = metrics.requests.total > 0
    ? (metrics.errors.total / metrics.requests.total * 100).toFixed(2)
    : 0;

  return {
    timestamp: new Date().toISOString(),
    requests: {
      total: metrics.requests.total,
      byMethod: metrics.requests.byMethod,
      byPath: metrics.requests.byPath,
    },
    errors: {
      total: metrics.errors.total,
      errorRate: `${errorRate}%`,
      by4xx: metrics.errors.by4xx,
      by5xx: metrics.errors.by5xx,
    },
    responseTimes: {
      avg: avgResponseTime,
      min: metrics.responseTimes.min === Infinity ? 0 : metrics.responseTimes.min,
      max: metrics.responseTimes.max,
      byPath: metrics.responseTimes.byPath,
    },
    health: {
      status: metrics.errors.by5xx > 10 ? 'degraded' : 'healthy',
      errorCountLast: metrics.errors.by5xx,
    },
  };
}

/**
 * Reset metrics (for testing)
 */
function resetMetrics() {
  metrics.requests.total = 0;
  metrics.requests.byMethod = {};
  metrics.requests.byPath = {};
  metrics.errors.total = 0;
  metrics.errors.by4xx = 0;
  metrics.errors.by5xx = 0;
  metrics.responseTimes.sum = 0;
  metrics.responseTimes.count = 0;
  metrics.responseTimes.min = Infinity;
  metrics.responseTimes.max = 0;
  metrics.responseTimes.byPath = {};
}

module.exports = {
  metricsMiddleware,
  getMetrics,
  resetMetrics,
};
