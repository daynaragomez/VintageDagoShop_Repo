/**
 * Test Environment Configuration
 * 
 * Centralized configuration for different environments (dev, staging, prod)
 * Provides database credentials, API endpoints, timeouts, and execution settings
 * 
 * Usage:
 *   const { getEnvironment } = require('./environments');
 *   const config = getEnvironment('dev');
 *   const config = getEnvironment(process.env.TEST_ENV || 'dev');
 */

const environments = {
  dev: {
    // Environment Info
    name: 'development',
    isCI: false,
    isProduction: false,
    
    // Frontend
    baseURL: 'http://localhost:5173',
    
    // Backend API
    apiURL: 'http://localhost:3000/api',
    
    // Database
    db: {
      host: 'localhost',
      port: 3306,
      user: 'vintagedago_user',
      password: 'secret',
      database: 'vintagedago',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    },
    
    // Playwright Settings
    playwright: {
      timeout: 30000,
      navigationTimeout: 30000,
      expectTimeout: 10000,
      fullyParallel: false,
      workers: 1,
      retries: 0,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      headless: false,
      slowMo: 100
    },
    
    // Retry Configuration
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      backoffMultiplier: 2
    },
    
    // Logging
    logLevel: 'debug',
    verbose: true
  },

  staging: {
    name: 'staging',
    isCI: true,
    isProduction: false,
    
    baseURL: 'https://staging.vintagedago.com',
    apiURL: 'https://staging.vintagedago.com/api',
    
    db: {
      host: process.env.STAGING_DB_HOST || 'staging-mysql',
      port: 3306,
      user: 'vintagedago_staging_user',
      password: process.env.STAGING_DB_PASSWORD || 'secret',
      database: 'vintagedago_staging',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    },
    
    playwright: {
      timeout: 45000,
      navigationTimeout: 45000,
      expectTimeout: 15000,
      fullyParallel: true,
      workers: 4,
      retries: 2,
      screenshot: 'on-failure',
      video: 'retain-on-failure',
      headless: true,
      slowMo: 0
    },
    
    retry: {
      maxAttempts: 4,
      initialDelay: 2000,
      backoffMultiplier: 2
    },
    
    logLevel: 'info',
    verbose: false
  },

  production: {
    name: 'production',
    isCI: true,
    isProduction: true,
    
    baseURL: 'https://vintagedago.com',
    apiURL: 'https://api.vintagedago.com',
    
    db: {
      host: process.env.PROD_DB_HOST,
      port: 3306,
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0
    },
    
    playwright: {
      timeout: 60000,
      navigationTimeout: 60000,
      expectTimeout: 20000,
      fullyParallel: true,
      workers: 8,
      retries: 3,
      screenshot: 'on-failure',
      video: 'off',
      headless: true,
      slowMo: 0
    },
    
    retry: {
      maxAttempts: 5,
      initialDelay: 3000,
      backoffMultiplier: 2
    },
    
    logLevel: 'warn',
    verbose: false
  },

  ci: {
    name: 'ci',
    isCI: true,
    isProduction: false,
    
    baseURL: process.env.BASE_URL || 'http://frontend-test:5173',
    apiURL: process.env.API_URL || 'http://backend-test:3000/api',
    
    db: {
      host: process.env.DB_HOST || 'mysql-test',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'vintagedago_user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'vintagedago_test',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    },
    
    playwright: {
      timeout: 60000,
      navigationTimeout: 30000,
      expectTimeout: 10000,
      fullyParallel: true,
      workers: 4,
      retries: 2,
      screenshot: 'on-failure',
      video: 'retain-on-failure',
      headless: true,
      slowMo: 0
    },
    
    retry: {
      maxAttempts: 3,
      initialDelay: 2000,
      backoffMultiplier: 2
    },
    
    logLevel: 'info',
    verbose: false
  }
};

/**
 * Get configuration for environment
 */
function getEnvironment(env = null) {
  const targetEnv = env || detectEnvironment();
  const config = environments[targetEnv];
  
  if (!config) {
    console.warn(`Unknown environment: ${targetEnv}, using 'dev'`);
    return environments.dev;
  }
  
  return { ...config, environment: targetEnv };
}

/**
 * Detect environment from various sources
 */
function detectEnvironment() {
  if (process.env.TEST_ENV) return process.env.TEST_ENV;
  if (process.env.CI) return 'ci';
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.NODE_ENV === 'staging') return 'staging';
  return 'dev';
}

/**
 * Get active configuration
 */
function getActiveConfig() {
  const env = detectEnvironment();
  return getEnvironment(env);
}

/**
 * Print configuration summary
 */
function printConfig(env = null) {
  const config = getEnvironment(env);
  console.log(`
📋 Test Configuration: ${config.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend URL: ${config.baseURL}
🔗 API URL: ${config.apiURL}
💾 Database: ${config.db.host}:${config.db.port}/${config.db.database}
⏱️  Timeout: ${config.playwright.timeout}ms
👷 Workers: ${config.playwright.workers}
🔄 Retries: ${config.playwright.retries}
📸 Screenshots: ${config.playwright.screenshot}
🎬 Video: ${config.playwright.video}
🐛 Log Level: ${config.logLevel}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

// For backward compatibility
const activeEnvironment = detectEnvironment();
const config = getEnvironment(activeEnvironment);

module.exports = {
  environments,
  getEnvironment,
  getActiveConfig,
  detectEnvironment,
  printConfig,
  config,
  activeEnvironment
};
