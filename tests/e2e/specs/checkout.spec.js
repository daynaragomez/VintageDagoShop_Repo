import { test }      from '../../fixtures/index.js';
import { CONSTANTS } from '../utils/constants.js';
import { testData }  from '../utils/testData.js';

const { LEATHER_JACKET } = CONSTANTS.PRODUCTS;

test.describe('Checkout Page', { tag: ['@ui', '@checkout'] }, () => {

  test.beforeEach(async ({ homeSteps, cartSteps }) => {
    await homeSteps.openShop();
    await homeSteps.addProductToCart(LEATHER_JACKET.id);
    await homeSteps.navigateToCart();
    await cartSteps.proceedToCheckout();
  });

  test('checkout form is visible', { tag: '@smoke' }, async ({ checkoutAssert }) => {
    await checkoutAssert.formIsVisible();
  });

  test('order summary shows 1 item', async ({ checkoutAssert }) => {
    await checkoutAssert.orderItemCountIs(1);
  });

  test('order total matches product price', async ({ checkoutAssert }) => {
    await checkoutAssert.orderTotalIsCloseTo(LEATHER_JACKET.price);
  });

  test('shows name error when name is empty',
    { tag: '@validation' },
    async ({ checkoutSteps, checkoutAssert }) => {
      await checkoutSteps.submitWithInvalidData(testData.invalidCustomer.missingName);
      await checkoutAssert.nameErrorVisible();
    }
  );

  test('shows email error when email is invalid',
    { tag: '@validation' },
    async ({ checkoutSteps, checkoutAssert }) => {
      await checkoutSteps.submitWithInvalidData(testData.invalidCustomer.badEmail);
      await checkoutAssert.emailErrorVisible();
    }
  );

  test('shows card error when card is missing',
    { tag: '@validation' },
    async ({ checkoutSteps, checkoutAssert }) => {
      await checkoutSteps.submitWithInvalidData(testData.invalidCustomer.missingCard);
      await checkoutAssert.cardErrorVisible();
    }
  );

  test('successful order navigates to confirmation',
    { tag: ['@smoke', '@critical'] },
    // eslint-disable-next-line no-unused-vars
    async ({ db, checkoutSteps, confirmationAssert }) => {
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);
      await confirmationAssert.pageIsVisible();
      await confirmationAssert.urlIsConfirmation();
    }
  );

  test('cart is empty after successful order',
    { tag: '@critical' },
    // eslint-disable-next-line no-unused-vars
    async ({ db, checkoutSteps, cartAssert, page }) => {
      await checkoutSteps.fillAndSubmitOrder(testData.validCustomer);
      await page.waitForURL('**/confirmation');
      await page.goto('/cart');
      await cartAssert.cartIsEmpty();
    }
  );
});
