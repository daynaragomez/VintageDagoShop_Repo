import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';

test.describe('Checkout Flow', () => {
  test('order total matches sum of added products', async ({ page }) => {
    const homePage = new HomePage(page);
    const checkoutPage = new CheckoutPage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(1);
    const total = await checkoutPage.getOrderTotal();
    expect(total).toBeCloseTo(89.99 + 45.5, 1);
  });

  test('correct product names appear in cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const checkoutPage = new CheckoutPage(page);
    await homePage.goto();
    await homePage.addProductToCart(2);
    const inCart = await checkoutPage.verifyItemInCart('Vintage Band T-Shirt');
    expect(inCart).toBe(true);
  });

  test('cart is empty after removing all items', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(1);
    await cartPage.removeItem(0);
    await cartPage.removeItem(0);
    const count = await checkoutPage.getCartItemCount();
    expect(count).toBe(0);
  });
});
