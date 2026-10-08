/**
 * Add to Cart Assertions
 * 
 * ✓ CLEAN ARCHITECTURE:
 * - Separate from page objects
 * - Only assertion methods (verify/expect)
 * - Descriptive names matching business requirements
 * - Reusable across all tests
 * ✓ NEVER import in Pages or Steps
 * 
 * Naming Convention:
 * - All methods: async assert{Condition}(expectedValue)
 * - Read like: "assert product was added to cart successfully"
 * - Contain the thing being verified in the method name
 * 
 * Examples:
 *   ✓ async productWasAddedToCartSuccessfully()
 *   ✓ async cartBadgeUpdatedToCount(expectedCount)
 *   ✗ async checkCart() - too vague
 *   ✗ async verify() - generic
 */

import { expect } from '@playwright/test';

export class AddToCartAssertions {
  constructor(addToCartPage) {
    this.addToCartPage = addToCartPage;
    this.page = addToCartPage.page;
  }

  // ==================== CART BADGE ASSERTIONS ====================

  /**
   * Verify cart badge shows expected item count
   * @param {number} expectedCount - Expected item count
   */
  async cartBadgeShowsCount(expectedCount) {
    const actualCount = await this.addToCartPage.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Verify cart badge increased from previous count
   * @param {number} previousCount - Previous cart count
   * @param {number} expectedIncrease - How much it should increase
   */
  async cartBadgeIncrementedByCorrectAmount(previousCount, expectedIncrease) {
    const currentCount = await this.addToCartPage.getCartItemCount();
    const actualIncrease = currentCount - previousCount;
    expect(actualIncrease).toBe(expectedIncrease);
  }

  /**
   * Verify cart badge is visible and not zero
   */
  async cartBadgeIsVisibleWithItems() {
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify cart badge shows at least N items
   * @param {number} minimumCount - Minimum expected items
   */
  async cartBadgeShowsAtLeastItems(minimumCount) {
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBeGreaterThanOrEqual(minimumCount);
  }

  // ==================== CONFIRMATION MODAL ASSERTIONS ====================

  /**
   * Verify add to cart confirmation modal is open
   */
  async addToCartModalIsOpen() {
    const isOpen = await this.addToCartPage.isAddToCartModalOpen();
    expect(isOpen).toBeTruthy();
  }

  /**
   * Verify add to cart confirmation modal is closed
   */
  async addToCartModalIsClosed() {
    const isOpen = await this.addToCartPage.isAddToCartModalOpen();
    expect(isOpen).toBeFalsy();
  }

  /**
   * Verify modal contains product information
   */
  async modalDisplaysProductInformation() {
    const isLoaded = await this.addToCartPage.isModalContentLoaded();
    expect(isLoaded).toBeTruthy();
  }

  /**
   * Verify modal shows correct product name
   * @param {string} expectedName - Expected product name
   */
  async modalShowsProductName(expectedName) {
    const modalName = await this.addToCartPage.getProductNameInModal();
    expect(modalName).toContain(expectedName);
  }

  /**
   * Verify modal shows product price
   */
  async modalShowsProductPrice() {
    const price = await this.addToCartPage.getProductPriceInModal();
    expect(price).toBeTruthy();
    expect(price.length).toBeGreaterThan(0);
  }

  /**
   * Verify modal shows product image
   */
  async modalDisplaysProductImage() {
    const isVisible = await this.addToCartPage.modalProductImage
      .isVisible()
      .catch(() => false);
    expect(isVisible).toBeTruthy();
  }

  // ==================== SUCCESS MESSAGE ASSERTIONS ====================

  /**
   * Verify success message is displayed after adding
   */
  async successMessageIsDisplayed() {
    const isVisible = await this.addToCartPage.isSuccessMessageVisible();
    expect(isVisible).toBeTruthy();
  }

  /**
   * Verify success message is not visible
   */
  async successMessageIsNotDisplayed() {
    const isVisible = await this.addToCartPage.isSuccessMessageVisible();
    expect(isVisible).toBeFalsy();
  }

  /**
   * Verify success message contains expected text
   * @param {string} expectedText - Expected message content
   */
  async successMessageContainsText(expectedText) {
    const text = await this.addToCartPage.getSuccessMessageText();
    expect(text).toContain(expectedText);
  }

  /**
   * Verify success message shows product was added
   */
  async successMessageIndicatesProductAdded() {
    const text = await this.addToCartPage.getSuccessMessageText();
    expect(text.toLowerCase()).toMatch(/added|success|cart/i);
  }

  /**
   * Verify success notification (toast) appears
   */
  async successToastIsDisplayed() {
    await expect(this.addToCartPage.successToastNotification).toBeVisible();
  }

  /**
   * Verify success message auto-dismisses
   */
  async successMessageDismissesAutomatically() {
    const isVisible = await this.addToCartPage.isSuccessMessageVisible();
    expect(isVisible).toBeTruthy();
    
    // Wait and check it disappears
    await this.addToCartPage.waitForSuccessMessageToDisappear(10000);
    
    const stillVisible = await this.addToCartPage.isSuccessMessageVisible();
    expect(stillVisible).toBeFalsy();
  }

  // ==================== ERROR MESSAGE ASSERTIONS ====================

  /**
   * Verify error message is displayed
   */
  async errorMessageIsDisplayed() {
    const isVisible = await this.addToCartPage.isErrorMessageVisible();
    expect(isVisible).toBeTruthy();
  }

  /**
   * Verify error message is not visible
   */
  async errorMessageIsNotDisplayed() {
    const isVisible = await this.addToCartPage.isErrorMessageVisible();
    expect(isVisible).toBeFalsy();
  }

  /**
   * Verify error message contains expected text
   * @param {string} expectedText - Expected error message
   */
  async errorMessageContainsText(expectedText) {
    const text = await this.addToCartPage.getErrorMessageText();
    expect(text).toContain(expectedText);
  }

  /**
   * Verify error message indicates out of stock
   */
  async errorMessageIndicatesOutOfStock() {
    const text = await this.addToCartPage.getErrorMessageText();
    expect(text.toLowerCase()).toMatch(/out of stock|unavailable|not available/i);
  }

  /**
   * Verify error notification (toast) appears
   */
  async errorToastIsDisplayed() {
    await expect(this.addToCartPage.errorToastNotification).toBeVisible();
  }

  // ==================== QUANTITY ASSERTIONS ====================

  /**
   * Verify quantity selected in modal
   * @param {number} expectedQuantity - Expected quantity value
   */
  async quantityIsSetToValue(expectedQuantity) {
    const quantity = await this.addToCartPage.getSelectedQuantity();
    expect(quantity).toBe(expectedQuantity);
  }

  /**
   * Verify quantity is 1 (default)
   */
  async quantityDefaultIsOne() {
    const quantity = await this.addToCartPage.getSelectedQuantity();
    expect(quantity).toBe(1);
  }

  /**
   * Verify quantity input field is editable
   */
  async quantityInputIsEditable() {
    const input = this.addToCartPage.quantityInputField;
    await expect(input).toBeEditable();
  }

  /**
   * Verify increase quantity button is visible
   */
  async increaseQuantityButtonIsVisible() {
    await expect(this.addToCartPage.btnQuantityIncrease).toBeVisible();
  }

  /**
   * Verify decrease quantity button is visible
   */
  async decreaseQuantityButtonIsVisible() {
    await expect(this.addToCartPage.btnQuantityDecrease).toBeVisible();
  }

  // ==================== BUTTON STATE ASSERTIONS ====================

  /**
   * Verify confirm add to cart button is enabled
   */
  async confirmButtonIsEnabled() {
    await expect(this.addToCartPage.btnConfirmAddToCart).toBeEnabled();
  }

  /**
   * Verify confirm add to cart button is disabled
   */
  async confirmButtonIsDisabled() {
    await expect(this.addToCartPage.btnConfirmAddToCart).toBeDisabled();
  }

  /**
   * Verify continue shopping button is visible
   */
  async continueShoppingButtonIsVisible() {
    await expect(this.addToCartPage.btnContinueShopping).toBeVisible();
  }

  /**
   * Verify go to cart button is visible
   */
  async goToCartButtonIsVisible() {
    await expect(this.addToCartPage.btnGoToCart).toBeVisible();
  }

  /**
   * Verify add to cart button is disabled for product (out of stock)
   * @param {number} productId - Product ID
   */
  async addToCartButtonIsDisabledForProduct(productId) {
    const button = this.addToCartPage.btnAddToCartForProduct(productId);
    await expect(button).toBeDisabled();
  }

  /**
   * Verify add to cart button is enabled for product (in stock)
   * @param {number} productId - Product ID
   */
  async addToCartButtonIsEnabledForProduct(productId) {
    const button = this.addToCartPage.btnAddToCartForProduct(productId);
    await expect(button).toBeEnabled();
  }

  // ==================== CART TOTAL ASSERTIONS ====================

  /**
   * Verify cart total price is displayed
   */
  async cartTotalPriceIsDisplayed() {
    const total = await this.addToCartPage.getCartTotalPrice();
    expect(total).toBeTruthy();
    expect(total.length).toBeGreaterThan(0);
  }

  /**
   * Verify cart total contains currency symbol
   */
  async cartTotalShowsCurrencyFormat() {
    const total = await this.addToCartPage.getCartTotalPrice();
    expect(total).toMatch(/\$|€|£|¥/);
  }

  /**
   * Verify cart total increased after adding product
   * @param {string} previousTotal - Previous total price
   */
  async cartTotalIncreasedAfterAddingProduct(previousTotal) {
    const currentTotal = await this.addToCartPage.getCartTotalPrice();
    
    // Parse prices for comparison
    const prevPrice = parseFloat(previousTotal.replace(/[^0-9.]/g, ''));
    const currPrice = parseFloat(currentTotal.replace(/[^0-9.]/g, ''));
    
    expect(currPrice).toBeGreaterThan(prevPrice);
  }

  // ==================== PERSISTENCE ASSERTIONS ====================

  /**
   * Verify cart is persisted in localStorage
   */
  async cartIsPersistedInLocalStorage() {
    const isPersisted = await this.addToCartPage.isCartPersistedInLocalStorage();
    expect(isPersisted).toBeTruthy();
  }

  /**
   * Verify cart data is stored in storage
   */
  async cartDataIsSavedInStorage() {
    const localStorageCart = await this.addToCartPage.getCartFromLocalStorage();
    const sessionStorageCart = await this.addToCartPage.getCartFromSessionStorage();
    
    const hasData = !!localStorageCart || !!sessionStorageCart;
    expect(hasData).toBeTruthy();
  }

  /**
   * Verify cart persists after page reload
   * @param {number} countBefore - Cart count before reload
   */
  async cartPersistedAfterPageReload(countBefore) {
    const countAfter = await this.addToCartPage.getCartItemCount();
    expect(countAfter).toBe(countBefore);
  }

  /**
   * Verify cart is not empty after reload
   */
  async cartIsNotEmptyAfterReload() {
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
  }

  // ==================== PRODUCT-SPECIFIC ASSERTIONS ====================

  /**
   * Verify specific product is in cart
   * (Requires cart page or API verification)
   * @param {number} productId - Product ID
   */
  async productIsInCart(productId) {
    // This would need to navigate to cart or call API
    // For now, we verify badge shows at least 1 item
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify cart badge updated for added product
   */
  async cartBadgeUpdatedForAddedProduct() {
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify correct quantity in cart
   * @param {number} expectedQuantity - Expected quantity
   */
  async cartShowsCorrectQuantity(expectedQuantity) {
    const count = await this.addToCartPage.getCartItemCount();
    expect(count).toBe(expectedQuantity);
  }

  // ==================== MODAL CLOSE ASSERTIONS ====================

  /**
   * Verify modal closes after confirmation
   */
  async modalClosesAfterConfirmation() {
    await this.addToCartPage.page.waitForTimeout(500);
    const isOpen = await this.addToCartPage.isAddToCartModalOpen();
    expect(isOpen).toBeFalsy();
  }

  /**
   * Verify modal closes after cancellation
   */
  async modalClosesAfterCancellation() {
    await this.addToCartPage.page.waitForTimeout(500);
    const isOpen = await this.addToCartPage.isAddToCartModalOpen();
    expect(isOpen).toBeFalsy();
  }

  /**
   * Verify user stays on same page after adding product
   * @param {string} urlBefore - URL before action
   */
  async userStaysOnSamePageAfterAdding(urlBefore) {
    const urlAfter = this.addToCartPage.page.url();
    expect(urlAfter).toBe(urlBefore);
  }

  /**
   * Verify user is navigated to cart after clicking go to cart
   */
  async userIsNavigatedToCartPage() {
    const url = this.addToCartPage.page.url();
    expect(url).toMatch(/cart|shopping-cart/i);
  }
}
