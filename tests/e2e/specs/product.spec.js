import { test }      from '../../fixtures/index.js';
import { CONSTANTS } from '../utils/constants.js';

const { LEATHER_JACKET } = CONSTANTS.PRODUCTS;

test.describe('Product Page', { tag: ['@ui', '@product'] }, () => {

  test.beforeEach(async ({ productSteps }) => {
    await productSteps.openProduct(LEATHER_JACKET.id);
  });

  test('displays product name', { tag: '@smoke' }, async ({ productAssert }) => {
    await productAssert.nameIs(LEATHER_JACKET.name);
  });

  test('displays correct price', { tag: '@smoke' }, async ({ productAssert }) => {
    await productAssert.priceContains(LEATHER_JACKET.price.toFixed(2));
  });

  test('displays in stock message', async ({ productAssert }) => {
    await productAssert.stockContains('in stock');
  });

  test('Add to Cart button is visible initially', async ({ productAssert }) => {
    await productAssert.addToCartButtonVisible();
  });

  test('quantity controls appear after adding to cart', async ({ productSteps, productAssert }) => {
    await productSteps.addToCart();
    await productAssert.qtyControlsVisible();
    await productAssert.qtyInCartIs(1);
  });

  test('plus button is disabled when quantity equals stock',
    { tag: '@boundary' },
    async ({ db, productSteps, productAssert }) => {
      await productSteps.addToCart();
      await productSteps.increaseQuantityTo(LEATHER_JACKET.stock);
      await productAssert.plusButtonIsDisabled();
    }
  );

  test('View Cart navigates to cart page', async ({ page, productSteps }) => {
    await productSteps.addToCart();
    await productSteps.navigateToCart();
    await page.waitForURL('**/cart');
  });
});
