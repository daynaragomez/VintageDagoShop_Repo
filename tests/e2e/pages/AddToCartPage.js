/**
 * Add to Cart Page Object
 * 
 * ✓ PURPOSE: Encapsulates all locators and methods for cart operations
 * ✓ CLEAN ARCHITECTURE: Only locators and basic cart navigation/info methods
 * ✓ NO ASSERTIONS: All verifications are in AddToCartAssertions.js
 * ✓ NO BUSINESS LOGIC: All user actions are in AddToCartSteps.js
 * 
 * Handles:
 * - Adding products to cart (single, multiple, with quantity)
 * - Cart badge and counter updates
 * - Success/confirmation messages
 * - Quantity selectors and input fields
 * - Cart state persistence
 */

import { BasePage } from './BasePage.js';

export class AddToCartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Cart UI Elements
    this.cartIcon              = page.getByTestId('nav-cart');
    this.cartBadgeCounter      = page.getByTestId('cart-badge');
    this.navBarCartTotal       = page.getByTestId('navbar-cart-total');
    
    // Add to Cart Modal/Toast
    this.addToCartModal        = page.getByTestId('add-to-cart-modal');
    this.successMessage        = page.getByTestId('add-to-cart-success');
    this.successToast          = page.getByTestId('toast-success');
    this.errorMessage          = page.getByTestId('add-to-cart-error');
    this.errorToast            = page.getByTestId('toast-error');
    
    // Quantity Controls
    this.quantityInputField    = page.getByTestId('quantity-input');
    this.btnQuantityIncrease   = page.getByTestId('btn-quantity-increase');
    this.btnQuantityDecrease   = page.getByTestId('btn-quantity-decrease');
    
    // Modal Action Buttons
    this.btnConfirmAddToCart   = page.getByTestId('btn-confirm-add-to-cart');
    this.btnCancelAddToCart    = page.getByTestId('btn-cancel-add-to-cart');
    this.btnContinueShopping   = page.getByTestId('btn-continue-shopping');
    this.btnGoToCart           = page.getByTestId('btn-go-to-cart');
    
    // Product Info in Modal
    this.modalProductName      = page.getByTestId('modal-product-name');
    this.modalProductPrice     = page.getByTestId('modal-product-price');
    this.modalProductImage     = page.getByTestId('modal-product-image');
    this.modalProductStock     = page.getByTestId('modal-product-stock');
  }

  // ==================== PRODUCT-SPECIFIC LOCATORS ====================

  /**
   * Get "Add to Cart" button for specific product by ID
   * @param {number} productId - Product ID
   * @returns {Locator} Add to cart button
   */
  btnAddToCartForProduct(productId) {
    return this.page.getByTestId(`btn-add-to-cart-${productId}`);
  }

  /**
   * Get quantity selector for specific product
   * @param {number} productId - Product ID
   * @returns {Locator} Quantity input field
   */
  quantityInputForProduct(productId) {
    return this.page.getByTestId(`quantity-input-${productId}`);
  }

  // ==================== CART BADGE & COUNTER ====================

  /**
   * Get cart badge counter element
   * @returns {Locator} Badge showing cart item count
   */
  get cartBadge() {
    return this.cartBadgeCounter;
  }

  /**
   * Get cart total price display from navbar
   * @returns {Locator} Total price element
   */
  get cartTotalDisplay() {
    return this.navBarCartTotal;
  }

  // ==================== CONFIRMATION & SUCCESS ====================

  /**
   * Get add to cart confirmation modal
   * @returns {Locator} Modal element
   */
  get confirmationModal() {
    return this.addToCartModal;
  }

  /**
   * Get success message after product added
   * @returns {Locator} Success message element
   */
  get successNotification() {
    return this.successMessage;
  }

  /**
   * Get success toast notification
   * @returns {Locator} Toast element
   */
  get successToastNotification() {
    return this.successToast;
  }

  /**
   * Get error message if add to cart fails
   * @returns {Locator} Error message element
   */
  get errorNotification() {
    return this.errorMessage;
  }

  /**
   * Get error toast notification
   * @returns {Locator} Toast element
   */
  get errorToastNotification() {
    return this.errorToast;
  }

  // ==================== RETRIEVAL METHODS ====================

  /**
   * Get current cart badge count
   * @returns {Promise<number>} Current item count in cart
   */
  async getCartItemCount() {
    const badgeText = await this.cartBadgeCounter.textContent();
    return parseInt(badgeText) || 0;
  }

  /**
   * Get cart total price from navbar display
   * @returns {Promise<string>} Cart total price text (e.g., "$299.99")
   */
  async getCartTotalPrice() {
    const totalText = await this.navBarCartTotal.textContent();
    return totalText.trim();
  }

  /**
   * Get quantity value from modal/input
   * @returns {Promise<number>} Current quantity value
   */
  async getSelectedQuantity() {
    const value = await this.quantityInputField.inputValue();
    return parseInt(value) || 1;
  }

  /**
   * Get product name from confirmation modal
   * @returns {Promise<string>} Product name shown in modal
   */
  async getProductNameInModal() {
    const text = await this.modalProductName.textContent();
    return text.trim();
  }

  /**
   * Get product price from confirmation modal
   * @returns {Promise<string>} Product price shown in modal
   */
  async getProductPriceInModal() {
    const text = await this.modalProductPrice.textContent();
    return text.trim();
  }

  /**
   * Get success message text
   * @returns {Promise<string>} Success message content
   */
  async getSuccessMessageText() {
    const text = await this.successMessage.textContent();
    return text.trim();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message content
   */
  async getErrorMessageText() {
    const text = await this.errorMessage.textContent();
    return text.trim();
  }

  // ==================== STATE CHECK METHODS ====================

  /**
   * Check if add to cart modal is visible
   * @returns {Promise<boolean>} True if modal is open
   */
  async isAddToCartModalOpen() {
    return await this.addToCartModal.isVisible().catch(() => false);
  }

  /**
   * Check if success message is visible
   * @returns {Promise<boolean>} True if success shown
   */
  async isSuccessMessageVisible() {
    return await this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>} True if error shown
   */
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Check if confirmation modal has product info loaded
   * @returns {Promise<boolean>} True if modal content is populated
   */
  async isModalContentLoaded() {
    const name = await this.modalProductName.textContent();
    const price = await this.modalProductPrice.textContent();
    return !!(name && price && name.length > 0 && price.length > 0);
  }

  // ==================== INTERACTION METHODS ====================

  /**
   * Increase quantity by 1
   */
  async increaseQuantity() {
    await this.click(this.btnQuantityIncrease);
  }

  /**
   * Decrease quantity by 1
   */
  async decreaseQuantity() {
    await this.click(this.btnQuantityDecrease);
  }

  /**
   * Set specific quantity value
   * @param {number} quantity - Quantity to set
   */
  async setQuantity(quantity) {
    const input = this.quantityInputField;
    await this.click(input);
    await input.fill('');
    await this.fill(input, quantity.toString());
  }

  /**
   * Click "Confirm Add to Cart" button in modal
   */
  async confirmAddToCart() {
    await this.click(this.btnConfirmAddToCart);
    // Wait for modal to close and cart to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click "Cancel" button to close modal without adding
   */
  async cancelAddToCart() {
    await this.click(this.btnCancelAddToCart);
    // Wait for modal to close
    await this.page.waitForTimeout(500);
  }

  /**
   * Click "Continue Shopping" button after adding product
   */
  async continueShopping() {
    await this.click(this.btnContinueShopping);
    // Wait for navigation back to shop
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click "Go to Cart" button to navigate to cart page
   */
  async goToCart() {
    await this.click(this.btnGoToCart);
    // Wait for cart page to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ==================== WAIT METHODS ====================

  /**
   * Wait for add to cart modal to open
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForAddToCartModal(timeout = 10000) {
    await this.waitForElement(this.addToCartModal, { timeout });
  }

  /**
   * Wait for success message to appear
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForSuccessMessage(timeout = 5000) {
    await this.waitForElement(this.successMessage, { timeout });
  }

  /**
   * Wait for error message to appear
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForErrorMessage(timeout = 5000) {
    await this.waitForElement(this.errorMessage, { timeout });
  }

  /**
   * Wait for cart badge to update to specific count
   * @param {number} expectedCount - Expected cart item count
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForCartBadgeUpdate(expectedCount, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentCount = await this.getCartItemCount();
      if (currentCount === expectedCount) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Cart badge did not update to ${expectedCount} within ${timeout}ms`);
  }

  /**
   * Wait for success message to disappear (auto-dismiss)
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForSuccessMessageToDisappear(timeout = 10000) {
    await this.page.waitForFunction(
      () => {
        const msg = document.querySelector('[data-testid="add-to-cart-success"]');
        return !msg || !msg.isVisible;
      },
      { timeout }
    );
  }

  // ==================== CART PERSISTENCE ====================

  /**
   * Get cart data from localStorage
   * @returns {Promise<Object>} Cart data object
   */
  async getCartFromLocalStorage() {
    const cartData = await this.page.evaluate(() => {
      const data = localStorage.getItem('cart');
      return data ? JSON.parse(data) : null;
    });
    return cartData;
  }

  /**
   * Get cart data from sessionStorage
   * @returns {Promise<Object>} Cart data object
   */
  async getCartFromSessionStorage() {
    const cartData = await this.page.evaluate(() => {
      const data = sessionStorage.getItem('cart');
      return data ? JSON.parse(data) : null;
    });
    return cartData;
  }

  /**
   * Check if cart is persisted in localStorage
   * @returns {Promise<boolean>} True if cart data exists in localStorage
   */
  async isCartPersistedInLocalStorage() {
    const cartData = await this.getCartFromLocalStorage();
    return cartData !== null && Object.keys(cartData).length > 0;
  }

  /**
   * Reload page and verify cart persists
   * @returns {Promise<number>} Cart item count after reload
   */
  async reloadAndVerifyCartPersists() {
    const countBefore = await this.getCartItemCount();
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
    const countAfter = await this.getCartItemCount();
    return countAfter;
  }
}
