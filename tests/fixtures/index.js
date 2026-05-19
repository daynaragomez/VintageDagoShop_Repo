import { test as base } from '@playwright/test';
import { HomePage }         from '../e2e/pages/HomePage.js';
import { ProductPage }      from '../e2e/pages/ProductPage.js';
import { CartPage }         from '../e2e/pages/CartPage.js';
import { CheckoutPage }     from '../e2e/pages/CheckoutPage.js';
import { ConfirmationPage } from '../e2e/pages/ConfirmationPage.js';
import { ProductApiClient } from '../e2e/api/productApiClient.js';
import { OrderApiClient }   from '../e2e/api/orderApiClient.js';
import { dbHelper }         from '../e2e/db/dbHelper.js';

export const test = base.extend({
  // Page object fixtures — auto-instantiated per test
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

  // API client fixtures
  productApi: async ({ request }, use) => {
    await use(new ProductApiClient(request));
  },
  orderApi: async ({ request }, use) => {
    await use(new OrderApiClient(request));
  },

  // DB helper fixture — resets DB before each test automatically
  db: async ({}, use) => {
    dbHelper.fullReset();
    await use(dbHelper);
    dbHelper.fullReset();
  },
});

export { expect } from '@playwright/test';