import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { CartPage } from '../pages/CartPage.js';
import { ProductPage } from '../pages/ProductPage.js';

test.describe('Cart', () => {
  test('cart summary is hidden when empty', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    const visible = await cartPage.isCartVisible();
    expect(visible).toBe(false);
  });

  test('adds a product and shows cart summary', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    const visible = await homePage.isCartSummaryVisible();
    expect(visible).toBe(true);
  });

  test('cart count increments after adding product', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    const countText = await homePage.getCartCountText();
    expect(countText).toContain('1');
  });

  test('cart total updates after adding product', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    const total = await homePage.getCartTotalText();
    expect(total).toContain('89.99');
  });

  test('removes product from cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    await cartPage.removeItem(0);
    const visible = await cartPage.isCartVisible();
    expect(visible).toBe(false);
  });

  test('adding same product increases quantity badge', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(0);
    const qty = await productPage.getQuantityInCart(0);
    expect(qty).toBe(2);
  });

  test('adds multiple different products', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    await homePage.goto();
    await homePage.addProductToCart(0);
    await homePage.addProductToCart(1);
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });
});
