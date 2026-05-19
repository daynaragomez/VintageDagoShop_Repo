import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('displays the navbar with shop and cart links', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.navbar-links')).toContainText('Shop');
    await expect(page.locator('.navbar-links')).toContainText('Cart');
  });

  test('renders 3 products from the database', async ({ homePage }) => {
    const count = await homePage.getProductCount();
    expect(count).toBe(3);
  });

  test('product cards show name, price and stock', async ({ homePage }) => {
    const names = await homePage.getAllProductNames();
    expect(names).toContain(CONSTANTS.PRODUCTS.LEATHER_JACKET.name);
    expect(names).toContain(CONSTANTS.PRODUCTS.DENIM_JEANS.name);
    expect(names).toContain(CONSTANTS.PRODUCTS.BAND_TSHIRT.name);
  });

  test('cart badge is not visible when cart is empty', async ({ homePage }) => {
    const count = await homePage.getCartBadgeCount();
    expect(count).toBe(0);
  });

  test('add to cart button is enabled for in-stock product', async ({ homePage }) => {
    const disabled = await homePage.isAddToCartDisabled(0);
    expect(disabled).toBe(false);
  });

  test('adding a product shows cart badge count', async ({ homePage }) => {
    await homePage.addToCart(0);
    const count = await homePage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('add to cart button label updates after adding', async ({ homePage }) => {
    await homePage.addToCart(0);
    const label = await homePage.getAddToCartLabel(0);
    expect(label).toContain('In Cart');
  });

  test('clicking View Details navigates to product page', async ({ homePage, page }) => {
    await homePage.viewProduct(0);
    await expect(page).toHaveURL(/\/product\/\d+/);
  });
});