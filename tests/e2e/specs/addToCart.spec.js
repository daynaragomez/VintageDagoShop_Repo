/**
 * Add to Cart E2E Tests
 * 
 * Tests for adding products to cart with various scenarios
 * 
 * ✓ Tags: @P1 @cart @addToCart
 * ✓ Structure: Suite (descriptive) → Test (Cxxxxxx) → Only steps/assertions
 * ✓ Test format: CxxxN - Readable name @CxxxN (no arrange code, only act/assert)
 * 
 * Focus: Cart operations, quantity management, persistence
 * NOT focus: Checkout (covered in separate suite)
 */

import { test, expect } from '@playwright/test';
import { ProductBrowsingPage } from '../pages/ProductBrowsingPage.js';
import { AddToCartPage } from '../pages/AddToCartPage.js';
import { ProductBrowsingSteps } from '../steps/ProductBrowsingSteps.js';
import { AddToCartSteps } from '../steps/AddToCartSteps.js';
import { AddToCartAssertions } from '../assertions/AddToCartAssertions.js';
import { DbHelper } from '../support/db-helper.js';
import { Logger } from '../support/logger.js';

const logger = new Logger('addToCart.spec');
const PRODUCT_IDS = [1, 2, 3];

test.describe('Add to Cart Operations @P1 @addToCart', () => {
  let dbHelper;
  let productBrowsingPage;
  let addToCartPage;
  let productBrowsingSteps;
  let addToCartSteps;
  let addToCartAssertions;

  test.beforeEach(async ({ page }) => {
    
    dbHelper = new DbHelper({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'vintagedago_user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'vintagedago',
    });
    
    await dbHelper.connect();
    await dbHelper.resetDatabase();
    
    productBrowsingPage = new ProductBrowsingPage(page);
    addToCartPage = new AddToCartPage(page);
    productBrowsingSteps = new ProductBrowsingSteps(productBrowsingPage);
    addToCartSteps = new AddToCartSteps(addToCartPage);
    addToCartAssertions = new AddToCartAssertions(addToCartPage);
  });

  test.afterEach(async () => {
    if (dbHelper) {
      await dbHelper.closeConnection();
    }
  });

  test('C001 - Add product with default quantity and update badge @C001 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCart(PRODUCT_IDS[0]);
    await addToCartAssertions.cartBadgeShowsCount(1);
    await addToCartAssertions.successMessageIsDisplayed();
  });

  test('C002 - Add product with custom quantity @C002', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCartWithQuantity(PRODUCT_IDS[0], 3);
    await addToCartAssertions.cartBadgeShowsCount(3);
  });

  test('C003 - Add multiple different products to cart @C003 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsMultipleProductsToCart(PRODUCT_IDS);
    await addToCartAssertions.cartBadgeShowsCount(3);
  });

  test('C004 - Cancel add to cart operation @C004', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userCancelsAddingProductToCart(PRODUCT_IDS[0]);
    await addToCartAssertions.cartBadgeShowsCount(0);
  });

  test('C005 - Handle out of stock products @C005 @smoke', async () => {
    await dbHelper.executeInTransaction(async (conn) => {
      await conn.query('UPDATE products SET stock = 0 WHERE id = ?', [1]);
    });
    
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartAssertions.addToCartButtonIsDisabledForProduct(1);
  });

  test('C006 - Update badge when adding same product multiple times @C006', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsSameProductToCartMultipleTimes(PRODUCT_IDS[0], 3);
    await addToCartAssertions.cartBadgeShowsCount(3);
  });

  test('C007 - Persist cart data after page reload @C007 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCart(PRODUCT_IDS[0]);
    
    const countBefore = await addToCartPage.getCartItemCount();
    addToCartPage.page.reload();
    await addToCartPage.page.waitForLoadState('domcontentloaded');
    
    await addToCartAssertions.cartPersistedAfterPageReload(countBefore);
    await addToCartAssertions.cartBadgeShowsCount(1);
  });

  test('C008 - Display success message after adding product @C008 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCart(PRODUCT_IDS[0]);
    await addToCartAssertions.successMessageIsDisplayed();
    await addToCartAssertions.successMessageIndicatesProductAdded();
  });

  test('C009 - Allow user to continue shopping after adding product @C009', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductAndContinuesShopping(PRODUCT_IDS[0]);
    
    expect(addToCartPage.page.url()).toContain('shop');
    await addToCartAssertions.cartBadgeShowsCount(1);
  });

  test('C010 - Increase cart total price when adding product @C010', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCart(PRODUCT_IDS[0]);
    await addToCartAssertions.cartTotalPriceIsDisplayed();
    await addToCartAssertions.cartTotalShowsCurrencyFormat();
  });

  test('C011 - Add multiple products with different quantities @C011 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCartWithQuantity(PRODUCT_IDS[0], 2);
    await addToCartSteps.userAddsProductToCartWithQuantity(PRODUCT_IDS[1], 3);
    await addToCartAssertions.cartBadgeShowsCount(5);
  });

  test('C012 - Disable add to cart button for zero-stock product @C012 @smoke', async () => {
    await dbHelper.executeInTransaction(async (conn) => {
      await conn.query('UPDATE products SET stock = 0 WHERE id = ?', [PRODUCT_IDS[1]]);
    });
    
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartAssertions.addToCartButtonIsDisabledForProduct(PRODUCT_IDS[1]);
    await addToCartAssertions.addToCartButtonIsEnabledForProduct(PRODUCT_IDS[0]);
  });

  test('C013 - Maintain cart state when quickly adding products @C013', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userRapidlyAddsMultipleProducts([PRODUCT_IDS[0], PRODUCT_IDS[1]]);
    
    const finalCount = await addToCartPage.getCartItemCount();
    expect(finalCount).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Quantity Control @P1 @addToCart', () => {
  let dbHelper;
  let productBrowsingPage;
  let addToCartPage;
  let productBrowsingSteps;
  let addToCartSteps;
  let addToCartAssertions;

  test.beforeEach(async ({ page }) => {
    dbHelper = new DbHelper({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'vintagedago_user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'vintagedago',
    });
    
    await dbHelper.connect();
    await dbHelper.resetDatabase();
    
    productBrowsingPage = new ProductBrowsingPage(page);
    addToCartPage = new AddToCartPage(page);
    productBrowsingSteps = new ProductBrowsingSteps(productBrowsingPage);
    addToCartSteps = new AddToCartSteps(addToCartPage);
    addToCartAssertions = new AddToCartAssertions(addToCartPage);
  });

  test.afterEach(async () => {
    if (dbHelper) {
      await dbHelper.closeConnection();
    }
  });

  test('C014 - Increase quantity using increment button @C014 @smoke', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userClicksIncreaseQuantityButtonMultipleTimes(PRODUCT_IDS[0], 3);
    await addToCartAssertions.cartBadgeShowsCount(4);
  });

  test('C015 - Type custom quantity directly in input @C015', async () => {
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userTypesCustomQuantityAndAdds(PRODUCT_IDS[0], '5');
    await addToCartAssertions.cartBadgeShowsCount(5);
  });
});
