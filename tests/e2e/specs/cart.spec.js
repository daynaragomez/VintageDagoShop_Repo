import { test }      from '../../fixtures/index.js';
import { CONSTANTS } from '../utils/constants.js';

const { LEATHER_JACKET, DENIM_JEANS } = CONSTANTS.PRODUCTS;

test.describe('Cart Page', { tag: ['@ui', '@cart'] }, () => {

  test('shows empty state when cart has no items', { tag: '@smoke' },
    async ({ cartSteps, cartAssert }) => {
      await cartSteps.openCart();
      await cartAssert.cartIsEmpty();
    }
  );

  test('shows item row after adding product',
    async ({ productApi, homeSteps, cartAssert }) => {
      await productApi.expectProductsLoaded();
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartAssert.itemCountIs(1);
    }
  );

  test('item name matches the added product',
    async ({ homeSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartAssert.itemNameIs(LEATHER_JACKET.id, LEATHER_JACKET.name);
    }
  );

  test('order total matches product price',
    async ({ homeSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartAssert.totalIsCloseTo(LEATHER_JACKET.price);
    }
  );

  test('removing item leaves cart empty',
    async ({ homeSteps, cartSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartSteps.removeProduct(LEATHER_JACKET.id);
      await cartAssert.cartIsEmpty();
    }
  );

  test('adding 2 products shows 2 rows',
    async ({ homeSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.addProductToCart(DENIM_JEANS.id);
      await homeSteps.navigateToCart();
      await cartAssert.itemCountIs(2);
    }
  );

  test('total sums both products correctly',
    async ({ homeSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.addProductToCart(DENIM_JEANS.id);
      await homeSteps.navigateToCart();
      await cartAssert.totalIsCloseTo(LEATHER_JACKET.price + DENIM_JEANS.price);
    }
  );

  test('plus button is disabled when qty reaches stock',
    { tag: '@boundary' },
    async ({ homeSteps, cartSteps, cartAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      for (let i = 1; i < LEATHER_JACKET.stock; i++) {
        await cartSteps.increaseItemQty(LEATHER_JACKET.id);
      }
      await cartAssert.plusButtonIsDisabled(LEATHER_JACKET.id);
    }
  );

  test('Proceed to Checkout navigates to /checkout',
    { tag: '@smoke' },
    async ({ page, homeSteps, cartSteps }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartSteps.proceedToCheckout();
      await page.waitForURL('**/checkout');
    }
  );
});
