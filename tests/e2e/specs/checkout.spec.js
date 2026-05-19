import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';
import { testData }     from '../utils/testData.js';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('displays order summary with correct item', async ({ checkoutPage }) => {
    const count = await checkoutPage.getOrderItemCount();
    expect(count).toBe(1);
  });

  test('order total matches product price', async ({ checkoutPage }) => {
    const total = await checkoutPage.getOrderTotal();
    expect(total).toBeCloseTo(CONSTANTS.PRODUCTS.LEATHER_JACKET.price, 1);
  });

  test('shows validation errors when form is empty and submitted', async ({ checkoutPage }) => {
    await checkoutPage.placeOrder();
    const hasErrors = await checkoutPage.hasFormErrors();
    expect(hasErrors).toBe(true);
  });

  test('does not submit with invalid email', async ({ checkoutPage }) => {
    await checkoutPage.fillForm(testData.invalidCustomer.badEmail);
    await checkoutPage.placeOrder();
    const hasErrors = await checkoutPage.hasFormErrors();
    expect(hasErrors).toBe(true);
  });

  test('successful order navigates to confirmation page', async ({ checkoutPage, page, db }) => {
    await checkoutPage.submitOrder(testData.validCustomer);
    await expect(page).toHaveURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });
  });

  test('cart is empty after successful order', async ({ checkoutPage, cartPage, page, db }) => {
    await checkoutPage.submitOrder(testData.validCustomer);
    await page.waitForURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });
    await page.goto(CONSTANTS.ROUTES.CART);
    const empty = await cartPage.isEmpty();
    expect(empty).toBe(true);
  });
});