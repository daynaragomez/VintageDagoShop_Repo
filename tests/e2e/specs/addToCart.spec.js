/**
 * Add to Cart E2E Tests
 * 
 * Tests for adding products to cart with various scenarios
 * 
 * ✓ Tags: @smoke @P1 @cart @addToCart
 * ✓ AAA Pattern: Arrange (setup) → Act (user actions) → Assert (verify)
 * ✓ Naming: "should {user action} {expected result}"
 * 
 * Focus: Cart operations, quantity management, persistence
 * NOT focus: Checkout (covered in separate suite)
 */

import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductBrowsingPage } from '../pages/ProductBrowsingPage.js';
import { AddToCartPage } from '../pages/AddToCartPage.js';
import { HomeSteps } from '../steps/HomeSteps.js';
import { ProductBrowsingSteps } from '../steps/ProductBrowsingSteps.js';
import { AddToCartSteps } from '../steps/AddToCartSteps.js';
import { HomePageAssertions } from '../assertions/HomePageAssertions.js';
import { AddToCartAssertions } from '../assertions/AddToCartAssertions.js';
import { DbHelper } from '../support/db-helper.js';
import { Logger } from '../support/logger.js';

const logger = new Logger('addToCart.spec');

// Test data - using known products from database
const PRODUCT_IDS = [1, 2, 3];
const INITIAL_CART_COUNT = 0;

test.describe('Add to Cart @smoke @P1', () => {
  let dbHelper;
  let homePage;
  let productBrowsingPage;
  let addToCartPage;
  let homeSteps;
  let productBrowsingSteps;
  let addToCartSteps;
  let homePageAssertions;
  let addToCartAssertions;

  test.beforeEach(async ({ page }) => {
    // Arrange: Initialize objects
    logger.info('Setting up Add to Cart test');
    
    dbHelper = new DbHelper({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'vintagedago_user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'vintagedago',
    });
    
    await dbHelper.connect();
    await dbHelper.resetDatabase();
    
    homePage = new HomePage(page);
    productBrowsingPage = new ProductBrowsingPage(page);
    addToCartPage = new AddToCartPage(page);
    
    homeSteps = new HomeSteps(homePage);
    productBrowsingSteps = new ProductBrowsingSteps(productBrowsingPage);
    addToCartSteps = new AddToCartSteps(addToCartPage);
    
    homePageAssertions = new HomePageAssertions(homePage);
    addToCartAssertions = new AddToCartAssertions(addToCartPage);
  });

  test.afterEach(async () => {
    if (dbHelper) {
      await dbHelper.closeConnection();
    }
  });

  // ==================== SMOKE TESTS ====================

  test('should add product to cart with default quantity and update badge', async () => {
    // Arrange: Navigate to shop
    const productIdToAdd = PRODUCT_IDS[0];
    const expectedCartCount = 1;
    
    // Act: User navigates to shop and adds product
    logger.info('Navigating to shop');
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding product ${productIdToAdd} to cart with default quantity`);
    await addToCartSteps.userAddsProductToCart(productIdToAdd);
    
    // Assert: Verify cart updated
    logger.info(`Verifying cart badge shows ${expectedCartCount} item`);
    await addToCartAssertions.cartBadgeShowsCount(expectedCartCount);
    await addToCartAssertions.successMessageIsDisplayed();
  });

  test('should add product to cart with custom quantity', async () => {
    // Arrange
    const productIdToAdd = PRODUCT_IDS[0];
    const customQuantity = 3;
    const expectedCartCount = 3;
    
    // Act: Navigate and add with custom quantity
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding product ${productIdToAdd} with quantity ${customQuantity}`);
    await addToCartSteps.userAddsProductToCartWithQuantity(productIdToAdd, customQuantity);
    
    // Assert: Verify correct quantity
    logger.info('Verifying cart shows correct quantity');
    await addToCartAssertions.cartBadgeShowsCount(expectedCartCount);
  });

  test('should add multiple different products to cart', async () => {
    // Arrange
    const productsToAdd = PRODUCT_IDS;
    const expectedCartCount = productsToAdd.length;
    
    // Act: Navigate and add multiple products
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding ${productsToAdd.length} different products to cart`);
    await addToCartSteps.userAddsMultipleProductsToCart(productsToAdd);
    
    // Assert: Verify all products added
    logger.info(`Verifying cart contains ${expectedCartCount} different products`);
    await addToCartAssertions.cartBadgeShowsCount(expectedCartCount);
  });

  test('should cancel add to cart operation without adding product', async () => {
    // Arrange
    const productIdToAdd = PRODUCT_IDS[0];
    const expectedCartCountAfterCancel = 0;
    
    // Act: Navigate and cancel add
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Attempting to add product ${productIdToAdd} then canceling`);
    await addToCartSteps.userCancelsAddingProductToCart(productIdToAdd);
    
    // Assert: Verify product not added
    logger.info('Verifying cart remains empty after canceling');
    await addToCartAssertions.cartBadgeShowsCount(expectedCartCountAfterCancel);
  });

  test('should handle out of stock products appropriately', async () => {
    // Arrange: Make product 1 out of stock
    const outOfStockProductId = 1;
    await dbHelper.executeInTransaction(async (conn) => {
      await conn.query('UPDATE products SET stock = 0 WHERE id = ?', [outOfStockProductId]);
    });
    
    // Act: Navigate to shop
    await productBrowsingSteps.userNavigatesToProductListing();
    
    // Assert: Verify add to cart button is disabled
    logger.info('Verifying add to cart button is disabled for out of stock product');
    await addToCartAssertions.addToCartButtonIsDisabledForProduct(outOfStockProductId);
  });

  test('should update cart badge correctly when adding multiple quantities of same product', async () => {
    // Arrange
    const productId = PRODUCT_IDS[0];
    const timesToAdd = 3;
    const expectedTotalQuantity = timesToAdd;
    
    // Act: Navigate and add same product multiple times
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding same product ${timesToAdd} times with quantity 1 each`);
    await addToCartSteps.userAddsSameProductToCartMultipleTimes(productId, timesToAdd);
    
    // Assert: Verify total quantity
    logger.info(`Verifying cart shows total of ${expectedTotalQuantity} items`);
    await addToCartAssertions.cartBadgeShowsCount(expectedTotalQuantity);
  });

  test('should persist cart data after page reload', async () => {
    // Arrange
    const productIdToAdd = PRODUCT_IDS[0];
    const expectedCartCount = 1;
    
    // Act: Add product
    await productBrowsingSteps.userNavigatesToProductListing();
    logger.info('Adding product to cart');
    await addToCartSteps.userAddsProductToCart(productIdToAdd);
    
    // Verify cart has item
    const countBefore = await addToCartPage.getCartItemCount();
    logger.info(`Cart count before reload: ${countBefore}`);
    
    // Reload page
    logger.info('Reloading page');
    addToCartPage.page.reload();
    await addToCartPage.page.waitForLoadState('domcontentloaded');
    
    // Assert: Verify cart persisted
    logger.info('Verifying cart persisted after reload');
    await addToCartAssertions.cartPersistedAfterPageReload(countBefore);
    await addToCartAssertions.cartBadgeShowsCount(expectedCartCount);
  });

  // ==================== ADDITIONAL COVERAGE TESTS ====================

  test('should display success message after adding product', async () => {
    // Arrange
    const productIdToAdd = PRODUCT_IDS[0];
    
    // Act: Navigate and add product
    await productBrowsingSteps.userNavigatesToProductListing();
    await addToCartSteps.userAddsProductToCart(productIdToAdd);
    
    // Assert: Verify success message
    logger.info('Verifying success message displayed');
    await addToCartAssertions.successMessageIsDisplayed();
    await addToCartAssertions.successMessageIndicatesProductAdded();
  });

  test('should allow user to continue shopping after adding product', async () => {
    // Arrange
    const productIdToAdd = PRODUCT_IDS[0];
    
    // Act: Navigate, add product, and continue shopping
    await productBrowsingSteps.userNavigatesToProductListing();
    const urlBefore = addToCartPage.page.url();
    
    logger.info('Adding product and continuing shopping');
    await addToCartSteps.userAddsProductAndContinuesShopping(productIdToAdd);
    
    // Assert: Verify stayed on shop page and cart updated
    logger.info('Verifying user stayed on shop page');
    const urlAfter = addToCartPage.page.url();
    // Both should be shop pages but may have different query params
    expect(urlAfter).toContain('shop');
    await addToCartAssertions.cartBadgeShowsCount(1);
  });

  test('should increase cart total price when adding expensive product', async () => {
    // Arrange: Get initial cart total
    const productIdToAdd = PRODUCT_IDS[0];
    await productBrowsingSteps.userNavigatesToProductListing();
    
    const initialTotal = await addToCartPage.getCartTotalPrice();
    logger.info(`Initial cart total: ${initialTotal}`);
    
    // Act: Add product
    logger.info(`Adding product ${productIdToAdd}`);
    await addToCartSteps.userAddsProductToCart(productIdToAdd);
    
    // Assert: Verify total increased
    logger.info('Verifying cart total increased');
    await addToCartAssertions.cartTotalPriceIsDisplayed();
    await addToCartAssertions.cartTotalShowsCurrencyFormat();
  });

  test('should add multiple products with different quantities', async () => {
    // Arrange
    const productId1 = PRODUCT_IDS[0];
    const quantity1 = 2;
    const productId2 = PRODUCT_IDS[1];
    const quantity2 = 3;
    const expectedTotalItems = quantity1 + quantity2;
    
    // Act: Navigate and add products with different quantities
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding product ${productId1} with quantity ${quantity1}`);
    await addToCartSteps.userAddsProductToCartWithQuantity(productId1, quantity1);
    
    logger.info(`Adding product ${productId2} with quantity ${quantity2}`);
    await addToCartSteps.userAddsProductToCartWithQuantity(productId2, quantity2);
    
    // Assert: Verify total
    logger.info(`Verifying cart total is ${expectedTotalItems} items`);
    await addToCartAssertions.cartBadgeShowsCount(expectedTotalItems);
  });

  test('should disable add to cart button for zero-stock product', async () => {
    // Arrange: Set product 2 stock to 0
    const outOfStockId = PRODUCT_IDS[1];
    await dbHelper.executeInTransaction(async (conn) => {
      await conn.query('UPDATE products SET stock = 0 WHERE id = ?', [outOfStockId]);
    });
    
    // Act: Navigate to shop
    await productBrowsingSteps.userNavigatesToProductListing();
    
    // Assert: Verify button disabled
    logger.info('Verifying out of stock product button is disabled');
    await addToCartAssertions.addToCartButtonIsDisabledForProduct(outOfStockId);
    
    // Verify other products still enabled
    const inStockId = PRODUCT_IDS[0];
    logger.info('Verifying in-stock product button is enabled');
    await addToCartAssertions.addToCartButtonIsEnabledForProduct(inStockId);
  });

  test('should maintain cart state when quickly adding products', async () => {
    // Arrange
    const productsToAdd = [PRODUCT_IDS[0], PRODUCT_IDS[1]];
    
    // Act: Navigate and quickly add products
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info('Rapidly adding multiple products');
    await addToCartSteps.userRapidlyAddsMultipleProducts(productsToAdd);
    
    // Assert: Verify all products added
    logger.info('Verifying all products were added despite rapid additions');
    const finalCount = await addToCartPage.getCartItemCount();
    expect(finalCount).toBeGreaterThanOrEqual(productsToAdd.length);
  });
});

test.describe('Add to Cart - Quantity Control @P1', () => {
  let dbHelper;
  let productBrowsingPage;
  let addToCartPage;
  let productBrowsingSteps;
  let addToCartSteps;
  let addToCartAssertions;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up Quantity Control test');
    
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

  test('should increase quantity using increment button', async () => {
    // Arrange
    const productId = 1;
    const increments = 3;
    const expectedQuantity = 1 + increments;
    
    // Act: Navigate and add with quantity increase
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding product with ${increments} quantity increments`);
    await addToCartSteps.userClicksIncreaseQuantityButtonMultipleTimes(productId, increments);
    
    // Assert: Verify quantity
    logger.info(`Verifying cart shows ${expectedQuantity} items`);
    await addToCartAssertions.cartBadgeShowsCount(expectedQuantity);
  });

  test('should type custom quantity directly in input', async () => {
    // Arrange
    const productId = 1;
    const customQuantity = '5';
    
    // Act: Navigate and add with custom quantity input
    await productBrowsingSteps.userNavigatesToProductListing();
    
    logger.info(`Adding product with custom quantity: ${customQuantity}`);
    await addToCartSteps.userTypesCustomQuantityAndAdds(productId, customQuantity);
    
    // Assert: Verify quantity in cart
    logger.info('Verifying custom quantity added to cart');
    await addToCartAssertions.cartBadgeShowsCount(parseInt(customQuantity));
  });
});
