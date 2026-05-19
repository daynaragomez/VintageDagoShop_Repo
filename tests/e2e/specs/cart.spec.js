import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';

test.describe('Cart Page', () => {
  test('shows empty message when cart has no items', async ({ cartPage }) => {
    await cartPage.goto();
    const empty = await cartPage.isEmpty();
    expect(empty).toBe(true);
  });

  test('shows item after adding from home page', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    const count = await cartPage.getItemCount();
    expect(count).toBe(1);
  });

  test('item name matches product added', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    const name = await cartPage.getItemName(0);
    expect(name).toContain(CONSTANTS.PRODUCTS.LEATHER_JACKET.name);
  });

  test('order total matches product price', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    const total = await cartPage.getOrderTotal();
    expect(total).toBeCloseTo(CONSTANTS.PRODUCTS.LEATHER_JACKET.price, 1);
  });

  test('removing item leaves cart empty', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    await cartPage.removeItem(0);
    const empty = await cartPage.isEmpty();
    expect(empty).toBe(true);
  });

  test('adding 2 different products shows 2 rows', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.addToCart(1);
    await homePage.goToCart();
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });

  test('order total sums multiple products', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.addToCart(1);
    await homePage.goToCart();
    const total = await cartPage.getOrderTotal();
    const expected = CONSTANTS.PRODUCTS.LEATHER_JACKET.price + CONSTANTS.PRODUCTS.DENIM_JEANS.price;
    expect(total).toBeCloseTo(expected, 1);
  });

  test('plus button disabled when quantity reaches stock limit', async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    for (let i = 1; i < CONSTANTS.PRODUCTS.LEATHER_JACKET.stock; i++) {
      await cartPage.incrementItem(0);
    }
    const disabled = await cartPage.isPlusDisabled(0);
    expect(disabled).toBe(true);
  });

  test('Proceed to Checkout navigates to checkout page', async ({ homePage, cartPage, page }) => {
    await homePage.goto();
    await homePage.addToCart(0);
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(CONSTANTS.ROUTES.CHECKOUT);
  });
});