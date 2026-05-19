import { defineConfig, devices } from '@playwright/test';

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
    baseURL:    'http://localhost:5173',
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
  webServer: {
    command:             'npm run dev',
    url:                 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout:             30000,
  },
});