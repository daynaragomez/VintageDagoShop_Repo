import { test }      from '../../fixtures/index.js';
import { CONSTANTS } from '../utils/constants.js';
import { testData }  from '../utils/testData.js';

const { LEATHER_JACKET, DENIM_JEANS } = CONSTANTS.PRODUCTS;

test.describe('E2E — Full Purchase Flow', { tag: ['@e2e', '@critical', '@smoke'] }, () => {

  test('user completes full purchase: browse → cart → checkout → confirmation',
    { tag: ['@smoke', '@critical'] },
    // eslint-disable-next-line no-unused-vars
    async ({ db, productApi, homeSteps, cartSteps, checkoutSteps,
             homeAssert, cartAssert, confirmationAssert }) => {

      await productApi.expectProductsLoaded();

      await homeSteps.openShop();
      await homeAssert.productCountIs(3);

      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeAssert.cartBadgeCountIs(1);

      await homeSteps.navigateToCart();
      await cartAssert.itemCountIs(1);
      await cartAssert.totalIsCloseTo(LEATHER_JACKET.price);

      await cartSteps.proceedToCheckout();
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);

      await confirmationAssert.pageIsVisible();
      await confirmationAssert.headingIsConfirmed();
      await confirmationAssert.iconIsVisible();
    }
  );

  test('stock decrements in DB after purchase',
    { tag: ['@critical', '@inventory'] },
    // eslint-disable-next-line no-unused-vars
    async ({ _db, productApi, homeSteps, cartSteps, checkoutSteps, confirmationAssert }) => {
      const before = await productApi.getById(LEATHER_JACKET.id);

      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartSteps.proceedToCheckout();
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);
      await confirmationAssert.pageIsVisible();

      const after = await productApi.getById(LEATHER_JACKET.id);
      if (parseInt(after.stock) !== parseInt(before.stock) - 1) {
        throw new Error(`Stock not decremented: before=${before.stock} after=${after.stock}`);
      }
    }
  );

  test('user can purchase multiple products in one order',
    { tag: '@e2e' },
    // eslint-disable-next-line no-unused-vars
    async ({ _db, homeSteps, cartSteps, checkoutSteps, cartAssert, confirmationAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.addProductToCart(DENIM_JEANS.id);
      await homeSteps.navigateToCart();
      await cartAssert.itemCountIs(2);
      await cartAssert.totalIsCloseTo(LEATHER_JACKET.price + DENIM_JEANS.price);
      await cartSteps.proceedToCheckout();
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);
      await confirmationAssert.pageIsVisible();
    }
  );

  test('user can shop again after order confirmation',
    { tag: '@e2e' },
    // eslint-disable-next-line no-unused-vars
    async ({ _db, homeSteps, cartSteps, checkoutSteps, confirmationPage, homeAssert }) => {
      await homeSteps.openShop();
      await homeSteps.addProductToCart(LEATHER_JACKET.id);
      await homeSteps.navigateToCart();
      await cartSteps.proceedToCheckout();
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);
      await confirmationPage.shopAgain();
      await homeAssert.productCountIs(3);
    }
  );
});
