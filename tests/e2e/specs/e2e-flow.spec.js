import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';
import { testData }     from '../utils/testData.js';

/**
 * Full end-to-end user journeys.
 * Each test exercises a complete flow from home to confirmation.
 */
test.describe('E2E — Full Purchase Flow', () => {
  test('user browses, adds to cart, checks out and sees confirmation', async ({
    homePage, cartPage, checkoutPage, confirmationPage, page, db,
  }) => {
    // 1. Browse products
    await homePage.goto();
    const count = await homePage.getProductCount();
    expect(count).toBe(3);

    // 2. Add jacket to cart
    await homePage.addToCart(0);
    expect(await homePage.getCartBadgeCount()).toBe(1);

    // 3. Go to cart
    await homePage.goToCart();
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getOrderTotal()).toBeCloseTo(CONSTANTS.PRODUCTS.LEATHER_JACKET.price, 1);

    // 4. Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.submitOrder(testData.validCustomer);

    // 5. Confirmation
    await expect(page).toHaveURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });
    const visible = await confirmationPage.isVisible();
    expect(visible).toBe(true);
  });

  test('stock decrements in DB after purchase', async ({
    homePage, cartPage, checkoutPage, page, db,
  }) => {
    const stockBefore = db.getStock(CONSTANTS.PRODUCTS.LEATHER_JACKET.name);

    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.submitOrder(testData.validCustomer);
    await page.waitForURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });

    const stockAfter = db.getStock(CONSTANTS.PRODUCTS.LEATHER_JACKET.name);
    expect(stockAfter).toBe(stockBefore - 1);
  });

  test('user can purchase multiple different products', async ({
    homePage, cartPage, checkoutPage, page, db,
  }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.addToCart(1);
    await homePage.goToCart();

    expect(await cartPage.getItemCount()).toBe(2);
    const expectedTotal = CONSTANTS.PRODUCTS.LEATHER_JACKET.price + CONSTANTS.PRODUCTS.DENIM_JEANS.price;
    expect(await cartPage.getOrderTotal()).toBeCloseTo(expectedTotal, 1);

    await cartPage.proceedToCheckout();
    await checkoutPage.submitOrder(testData.validCustomer);
    await expect(page).toHaveURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });
  });

  test('user can shop again after order confirmation', async ({
    homePage, cartPage, checkoutPage, confirmationPage, page, db,
  }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.submitOrder(testData.validCustomer);
    await page.waitForURL(CONSTANTS.ROUTES.CONFIRMATION, { timeout: CONSTANTS.TIMEOUTS.LONG });

    await confirmationPage.shopAgain();
    await expect(page).toHaveURL(CONSTANTS.ROUTES.HOME);
    expect(await homePage.getProductCount()).toBe(3);
  });
});