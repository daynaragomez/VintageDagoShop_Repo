import { test, expect } from '../../fixtures/index.js';
import { CONSTANTS }    from '../utils/constants.js';

const JACKET = CONSTANTS.PRODUCTS.LEATHER_JACKET;

test.describe('Product Page', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.goto(JACKET.id);
  });

  test('displays product name', async ({ productPage }) => {
    const name = await productPage.getName();
    expect(name).toContain(JACKET.name);
  });

  test('displays correct price', async ({ productPage }) => {
    const price = await productPage.getPrice();
    expect(price).toContain(JACKET.price.toFixed(2));
  });

  test('displays stock information', async ({ productPage }) => {
    const stock = await productPage.getStock();
    expect(stock).toContain('in stock');
  });

  test('shows Add to Cart button initially', async ({ productPage }) => {
    await expect(productPage.addToCartBtn).toBeVisible();
  });

  test('after adding to cart, shows quantity controls', async ({ productPage }) => {
    await productPage.addToCart();
    await expect(productPage.qtyControls).toBeVisible();
    const qty = await productPage.getQtyInCart();
    expect(qty).toBe(1);
  });

  test('plus button disabled when quantity reaches stock', async ({ productPage, db }) => {
    await productPage.addToCart();
    for (let i = 1; i < JACKET.stock; i++) {
      await productPage.incrementQty();
    }
    const disabled = await productPage.isPlusDisabled();
    expect(disabled).toBe(true);
  });

  test('View Cart button navigates to cart page', async ({ productPage, page }) => {
    await productPage.addToCart();
    await productPage.goToCart();
    await expect(page).toHaveURL(CONSTANTS.ROUTES.CART);
  });
});