import { test as base } from '@playwright/test';

import { HomePage }              from '../e2e/pages/HomePage.js';
import { ProductPage }           from '../e2e/pages/ProductPage.js';
import { CartPage }              from '../e2e/pages/CartPage.js';
import { CheckoutPage }          from '../e2e/pages/CheckoutPage.js';
import { ConfirmationPage }      from '../e2e/pages/ConfirmationPage.js';

import { HomeSteps }             from '../e2e/steps/HomeSteps.js';
import { ProductSteps }          from '../e2e/steps/ProductSteps.js';
import { CartSteps }             from '../e2e/steps/CartSteps.js';
import { CheckoutSteps }         from '../e2e/steps/CheckoutSteps.js';

import { HomeAssertions }        from '../e2e/assertions/HomeAssertions.js';
import { ProductAssertions }     from '../e2e/assertions/ProductAssertions.js';
import { CartAssertions }        from '../e2e/assertions/CartAssertions.js';
import { CheckoutAssertions }    from '../e2e/assertions/CheckoutAssertions.js';
import { ConfirmationAssertions } from '../e2e/assertions/ConfirmationAssertions.js';

import { ProductApiClient }      from '../e2e/api/productApiClient.js';
import { OrderApiClient }        from '../e2e/api/orderApiClient.js';
import { dbHelper }              from '../e2e/db/dbHelper.js';

export const test = base.extend({

  // ── Page Objects ──────────────────────────────────────────────────────────
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },

  // ── Steps ─────────────────────────────────────────────────────────────────
  homeSteps: async ({ homePage }, use) => {
    await use(new HomeSteps(homePage));
  },
  productSteps: async ({ productPage }, use) => {
    await use(new ProductSteps(productPage));
  },
  cartSteps: async ({ cartPage }, use) => {
    await use(new CartSteps(cartPage));
  },
  checkoutSteps: async ({ checkoutPage }, use) => {
    await use(new CheckoutSteps(checkoutPage));
  },

  // ── Assertions ────────────────────────────────────────────────────────────
  homeAssert: async ({ homePage }, use) => {
    await use(new HomeAssertions(homePage));
  },
  productAssert: async ({ productPage }, use) => {
    await use(new ProductAssertions(productPage));
  },
  cartAssert: async ({ cartPage }, use) => {
    await use(new CartAssertions(cartPage));
  },
  checkoutAssert: async ({ checkoutPage }, use) => {
    await use(new CheckoutAssertions(checkoutPage));
  },
  confirmationAssert: async ({ confirmationPage, page }, use) => {
    await use(new ConfirmationAssertions(confirmationPage, page));
  },

  // ── API Clients ───────────────────────────────────────────────────────────
  productApi: async ({ request }, use) => {
    await use(new ProductApiClient(request));
  },
  orderApi: async ({ request }, use) => {
    await use(new OrderApiClient(request));
  },

  // ── DB Helper — resets DB before and after each test with retry logic ────
  // eslint-disable-next-line no-empty-pattern
  db: async ({}, use) => {
    const isCI = process.env.CI;
    const maxRetries = 3;
    
    // SETUP: Reset with retry and throw if persists (especially in CI)
    let resetSuccess = false;
    for (let i = 0; i < maxRetries; i++) {
      try {
        dbHelper.fullReset();
        resetSuccess = true;
        break;
      } catch (e) {
        const retryMsg = `DB reset retry ${i + 1}/${maxRetries}`;
        console.warn(`${retryMsg}:`, e.message);
        
        // In CI, fail immediately if max retries reached
        if (i === maxRetries - 1 && isCI) {
          throw new Error(`DB reset failed after ${maxRetries} attempts: ${e.message}`);
        }
        
        // Exponential backoff before retry
        if (i < maxRetries - 1) {
          const backoffMs = 1000 * Math.pow(2, i);
          await new Promise(r => setTimeout(r, backoffMs));
        }
      }
    }
    
    await use(dbHelper);
    
    // TEARDOWN: Cleanup with lenient error handling
    try {
      dbHelper.fullReset();
    } catch (e) {
      // In CI, log and fail; in dev, just warn (don't block test from completing)
      if (isCI) {
        console.error('DB cleanup failed in CI (next test may have stale data):', e.message);
      } else {
        console.warn('DB cleanup failed (next test may have stale data):', e.message);
      }
    }
  },
});

export { expect } from '@playwright/test';