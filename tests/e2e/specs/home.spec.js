import { test }      from '../../fixtures/index.js';
import { CONSTANTS } from '../utils/constants.js';

const { LEATHER_JACKET, DENIM_JEANS, BAND_TSHIRT } = CONSTANTS.PRODUCTS;

test.describe('Home Page', { tag: ['@smoke', '@ui', '@home'] }, () => {

  test.beforeEach(async ({ homeSteps }) => {
    await homeSteps.openShop();
  });

  test('navbar is visible', { tag: '@smoke' }, async ({ homeAssert }) => {
    await homeAssert.navbarIsVisible();
  });

  test('renders 3 products from the database', { tag: '@smoke' }, async ({ homeAssert }) => {
    await homeAssert.productCountIs(3);
  });

  test('displays all product names', async ({ homeAssert }) => {
    await homeAssert.productNamesInclude([
      LEATHER_JACKET.name,
      DENIM_JEANS.name,
      BAND_TSHIRT.name,
    ]);
  });

  test('cart badge is hidden when cart is empty', { tag: '@smoke' }, async ({ homeAssert }) => {
    await homeAssert.cartBadgeNotVisible();
  });

  test('Add to Cart button is enabled for in-stock product', async ({ homeAssert }) => {
    await homeAssert.addToCartButtonIsEnabled(LEATHER_JACKET.id);
  });

  test('cart badge shows 1 after adding a product', async ({ homeSteps, homeAssert }) => {
    await homeSteps.addProductToCart(LEATHER_JACKET.id);
    await homeAssert.cartBadgeCountIs(1);
  });

  test('Add to Cart label updates to In Cart after adding', async ({ homeSteps, homeAssert }) => {
    await homeSteps.addProductToCart(LEATHER_JACKET.id);
    await homeAssert.addToCartLabelContains(LEATHER_JACKET.id, 'In Cart');
  });

  test('View Details navigates to product page', async ({ page, homeSteps }) => {
    await homeSteps.navigateToProduct(LEATHER_JACKET.id);
    await page.waitForURL(`**/product/${LEATHER_JACKET.id}`);
  });
});
