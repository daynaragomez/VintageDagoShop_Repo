import { defineConfig, devices } from '@playwright/test';

const targetBaseURL = process.env.STAGING_URL || 'http://localhost:5173';
const useWebServer = process.env.START_WEBSERVER === 'true';  // Only start if explicitly requested

export default defineConfig({
  testDir: './tests/e2e/specs',
  outputDir: 'test-results/artifacts',

  /* Run tests in files in parallel (but not test cases within files) */
  fullyParallel: false,

  /* Retry on CI only (2x retries to handle transient failures) */
  retries: process.env.CI ? 2 : 0,

  /* Limit workers on CI to avoid DB contention; use 2 locally for faster feedback */
  workers: process.env.CI ? 1 : 2,

  /* Global test timeout - increased for slower machines */
  timeout: 60000,

  /* Fail fast in CI if too many tests fail (avoid wasting time on broken build) */
  maxFailures: process.env.CI ? 5 : undefined,

  /* Prevent accidental .only() from blocking CI (dev should use full suite in CI) */
  forbidOnly: !!process.env.CI,

  /* Reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL:           targetBaseURL,
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'on-first-retry',
    navigationTimeout: 45000,  // Longer navigation timeout for slow networks
    
    /* Expect assertions timeout (for slow DOM updates) */
    expect: { timeout: 10000 },
  },

  projects: [
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use:  { ...devices['Desktop Firefox'] },
    },
  ],

  /* Start the Vite dev server automatically before running tests - only if explicitly requested */
  webServer: useWebServer
    ? {
        command:             'npm run dev',
        url:                 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout:             60000,
      }
    : undefined,
});