/**
 * Frontend Performance Monitoring
 * 
 * Tracks page load times, API response times, and other performance metrics
 * Uses the Performance API and sends metrics to the backend health endpoint
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: null,
      navigationTiming: null,
      resourceTiming: [],
      apiCalls: [],
      errors: [],
    };

    this.init();
  }

  init() {
    // Track page load timing
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        this.recordPageLoadTiming();
      });
    }

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.recordError(event.error);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError(event.reason);
    });
  }

  recordPageLoadTiming() {
    const timing = window.performance.timing;
    const navigationStart = timing.navigationStart;

    this.metrics.navigationTiming = {
      domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
      pageLoadTime: timing.loadEventEnd - navigationStart,
      domInteractive: timing.domInteractive - navigationStart,
      domContentLoadedEventStart: timing.domContentLoadedEventStart - navigationStart,
      firstPaint: this.getFirstPaint(),
    };

    this.metrics.pageLoadTime = this.metrics.navigationTiming.pageLoadTime;

    // Log slow page loads (>2000ms)
    if (this.metrics.pageLoadTime > 2000) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️ Slow page load detected: ${this.metrics.pageLoadTime}ms`,
        this.metrics.navigationTiming
      );
    }
  }

  getFirstPaint() {
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = window.performance.getEntriesByType('paint');
      const fp = paintEntries.find((entry) => entry.name === 'first-paint');
      return fp ? Math.round(fp.startTime) : null;
    }
    return null;
  }

  recordApiCall(method, path, duration, statusCode) {
    this.metrics.apiCalls.push({
      timestamp: new Date().toISOString(),
      method,
      path,
      duration,
      statusCode,
    });

    // Log slow API calls (>500ms)
    if (duration > 500) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️ Slow API call: ${method} ${path} (${duration}ms)`,
        { statusCode }
      );
    }

    // Keep only last 100 API calls in memory
    if (this.metrics.apiCalls.length > 100) {
      this.metrics.apiCalls = this.metrics.apiCalls.slice(-100);
    }
  }

  recordError(error) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error?.message || String(error),
      stack: error?.stack || null,
    };

    this.metrics.errors.push(errorInfo);

    // Keep only last 50 errors in memory
    if (this.metrics.errors.length > 50) {
      this.metrics.errors = this.metrics.errors.slice(-50);
    }
  }

  getMetrics() {
    return {
      timestamp: new Date().toISOString(),
      pageLoad: {
        time: this.metrics.pageLoadTime,
        timing: this.metrics.navigationTiming,
      },
      apiCalls: {
        total: this.metrics.apiCalls.length,
        avgTime: this.getAverageApiCallTime(),
        slowCalls: this.metrics.apiCalls.filter((call) => call.duration > 500).length,
        last10: this.metrics.apiCalls.slice(-10),
      },
      errors: {
        total: this.metrics.errors.length,
        recent: this.metrics.errors.slice(-5),
      },
    };
  }

  getAverageApiCallTime() {
    if (this.metrics.apiCalls.length === 0) return 0;
    const sum = this.metrics.apiCalls.reduce((acc, call) => acc + call.duration, 0);
    return Math.round(sum / this.metrics.apiCalls.length);
  }

  sendMetricsToBackend() {
    // Send metrics to backend health endpoint
    const metrics = this.getMetrics();
    fetch('/api/health')
      .then((res) => res.json())
      .then((backendMetrics) => {
        // eslint-disable-next-line no-console
        console.log('📊 Performance Metrics:', {
          frontend: metrics,
          backend: backendMetrics,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch backend metrics:', err);
      });
  }
}

// Create global instance
export const performanceMonitor = new PerformanceMonitor();

// Send metrics periodically (every 5 minutes)
setInterval(() => {
  performanceMonitor.sendMetricsToBackend();
}, 5 * 60 * 1000);

// Export for use in fetch wrappers
export function trackApiCall(method, path, duration, statusCode) {
  performanceMonitor.recordApiCall(method, path, duration, statusCode);
}

export default performanceMonitor;
