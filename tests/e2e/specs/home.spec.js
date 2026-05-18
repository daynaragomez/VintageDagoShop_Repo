import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductPage } from '../pages/ProductPage.js';

test.describe('Home Page', () => {
  test('displays page title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const title = await homePage.getText('header h1');
    expect(title).toBe('Vintage Dago Shop');
  });

  test('renders product grid with 3 products', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();
    const count = await productPage.productCards.count();
    expect(count).toBe(3);
  });

  test('displays product names, prices and stock', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();
    const names = await productPage.getAllProductNames();
    expect(names).toContain('Vintage Leather Jacket');
    expect(names).toContain('Retro Denim Jeans');
    expect(names).toContain('Vintage Band T-Shirt');
  });

  test('cart icon shows 0 items initially', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const count = await homePage.getCartCountText();
    expect(count).toContain('0');
  });
});
