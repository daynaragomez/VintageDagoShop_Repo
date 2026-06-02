import { defineConfig, devices } from '@playwright/test';

const targetBaseURL = process.env.STAGING_URL || 'http://localhost:5173';
const useWebServer = !process.env.STAGING_URL;

export default defineConfig({
  testDir: './tests/e2e/specs',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Limit workers on CI to avoid DB contention */
  workers: process.env.CI ? 1 : 2,

  /* Reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL:    targetBaseURL,
    trace:      'on-first-retry',
    screenshot: 'only-on-failure',
    video:      'on-first-retry',
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

  /* Start the Vite dev server automatically before running tests */
  webServer: useWebServer
    ? {
        command:             'npm run dev',
        url:                 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout:             30000,
      }
    : undefined,
});