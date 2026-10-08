/**
 * Add to Cart Steps - User Actions/Workflows
 * 
 * ✓ CLEAN ARCHITECTURE:
 * - Meaningful user actions (not low-level interactions)
 * - Readable as business scenarios
 * - Combines page methods into workflows
 * - Reusable across multiple tests
 * 
 * Naming Convention:
 * - All methods: async user{Action}{Description}(params)
 * - ALWAYS start with "user" to emphasize user action
 * - Descriptive: what the user does, not how the system responds
 * 
 * Examples:
 *   ✓ userAddsProductToCartWithQuantity(productId, quantity)
 *   ✗ addToCart() - too generic
 *   ✗ clickAddButton() - too technical
 * 
 * Rule: Readable like "User adds product to cart with quantity"
 */

export class AddToCartSteps {
  constructor(addToCartPage) {
    this.addToCartPage = addToCartPage;
  }

  /**
   * User adds a product to cart with default quantity (1)
   * Clicks button and confirms in modal if present
   * @param {number} productId - Product ID to add
   */
  async userAddsProductToCart(productId) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal or confirmation
    const isModalOpen = await this.addToCartPage.isAddToCartModalOpen();
    if (isModalOpen) {
      await this.addToCartPage.confirmAddToCart();
    } else {
      // If no modal, wait for cart to update
      await this.addToCartPage.page.waitForLoadState('networkidle');
    }
  }

  /**
   * User adds product to cart with specific quantity
   * Opens modal, increases quantity, and confirms
   * @param {number} productId - Product ID to add
   * @param {number} quantity - Quantity to add (must be > 1)
   */
  async userAddsProductToCartWithQuantity(productId, quantity) {
    // Validate quantity
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal to open
    await this.addToCartPage.waitForAddToCartModal();
    
    // If quantity > 1, increase it
    if (quantity > 1) {
      await this.addToCartPage.setQuantity(quantity);
    }
    
    // Confirm add to cart
    await this.addToCartPage.confirmAddToCart();
  }

  /**
   * User adds multiple different products to cart
   * Adds each product sequentially with quantity 1
   * @param {number[]} productIds - Array of product IDs to add
   */
  async userAddsMultipleProductsToCart(productIds) {
    for (const productId of productIds) {
      await this.userAddsProductToCart(productId);
      // Small delay between adds to ensure cart updates
      await this.addToCartPage.page.waitForTimeout(500);
    }
  }

  /**
   * User adds the same product multiple times (multiple line items)
   * @param {number} productId - Product ID
   * @param {number} timesToAdd - Number of times to add
   */
  async userAddsSameProductToCartMultipleTimes(productId, timesToAdd) {
    for (let i = 0; i < timesToAdd; i++) {
      await this.userAddsProductToCart(productId);
      await this.addToCartPage.page.waitForTimeout(500);
    }
  }

  /**
   * User increases quantity in confirmation modal before adding
   * @param {number} productId - Product ID
   * @param {number} newQuantity - New quantity to set
   */
  async userIncreasesQuantityAndAddsToCart(productId, newQuantity) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal
    await this.addToCartPage.waitForAddToCartModal();
    
    // Change quantity
    await this.addToCartPage.setQuantity(newQuantity);
    
    // Confirm
    await this.addToCartPage.confirmAddToCart();
  }

  /**
   * User increases quantity by clicking + button in modal
   * @param {number} productId - Product ID
   * @param {number} increments - Number of times to click + button
   */
  async userClicksIncreaseQuantityButtonMultipleTimes(productId, increments) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal
    await this.addToCartPage.waitForAddToCartModal();
    
    // Click increase button X times
    for (let i = 0; i < increments; i++) {
      await this.addToCartPage.increaseQuantity();
      await this.addToCartPage.page.waitForTimeout(100);
    }
    
    // Confirm
    await this.addToCartPage.confirmAddToCart();
  }

  /**
   * User decreases quantity using - button in modal
   * @param {number} productId - Product ID
   * @param {number} decrements - Number of times to click - button
   */
  async userClicksDecreaseQuantityButtonMultipleTimes(productId, decrements) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal
    await this.addToCartPage.waitForAddToCartModal();
    
    // Click decrease button X times
    for (let i = 0; i < decrements; i++) {
      await this.addToCartPage.decreaseQuantity();
      await this.addToCartPage.page.waitForTimeout(100);
    }
    
    // Confirm
    await this.addToCartPage.confirmAddToCart();
  }

  /**
   * User clicks add to cart but then cancels before confirming
   * @param {number} productId - Product ID
   */
  async userCancelsAddingProductToCart(productId) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal
    await this.addToCartPage.waitForAddToCartModal();
    
    // Cancel the action
    await this.addToCartPage.cancelAddToCart();
  }

  /**
   * User adds product and clicks "Continue Shopping"
   * Returns to shop page
   * @param {number} productId - Product ID
   */
  async userAddsProductAndContinuesShopping(productId) {
    await this.userAddsProductToCart(productId);
    
    // If modal has continue shopping button
    const modal = this.addToCartPage.confirmationModal;
    const isContinueButtonVisible = await this.addToCartPage.btnContinueShopping
      .isVisible()
      .catch(() => false);
    
    if (isContinueButtonVisible) {
      await this.addToCartPage.continueShopping();
    }
  }

  /**
   * User adds product and goes directly to cart page
   * @param {number} productId - Product ID
   */
  async userAddsProductAndGoesToCart(productId) {
    await this.userAddsProductToCart(productId);
    
    // Click go to cart button
    const isGoToCartVisible = await this.addToCartPage.btnGoToCart
      .isVisible()
      .catch(() => false);
    
    if (isGoToCartVisible) {
      await this.addToCartPage.goToCart();
    }
  }

  /**
   * User tries to add out-of-stock product
   * Should fail or show error
   * @param {number} productId - Product ID of out-of-stock item
   */
  async userAttemptsToAddOutOfStockProduct(productId) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    
    // Button might be disabled
    const isEnabled = await addButton.isEnabled().catch(() => false);
    
    if (isEnabled) {
      await this.addToCartPage.click(addButton);
      // Wait for error message
      await this.addToCartPage.waitForErrorMessage().catch(() => {
        // Error handling might work differently
      });
    }
  }

  /**
   * User adds product from product listing (not detail page)
   * Adds directly without leaving current page
   * @param {number} productId - Product ID
   */
  async userQuicklyAddsProductFromListing(productId) {
    // Get current URL to verify we stay on page
    const urlBefore = this.addToCartPage.page.url();
    
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for success message or cart update
    const isSuccessVisible = await this.addToCartPage.isSuccessMessageVisible();
    if (isSuccessVisible) {
      await this.addToCartPage.page.waitForTimeout(2000); // Wait for auto-dismiss
    } else {
      await this.addToCartPage.page.waitForLoadState('networkidle');
    }
    
    // Verify we're still on same page
    const urlAfter = this.addToCartPage.page.url();
    if (urlBefore !== urlAfter) {
      throw new Error('Unexpected navigation after adding to cart');
    }
  }

  /**
   * User adds maximum allowed quantity of a product
   * @param {number} productId - Product ID
   * @param {number} maxQuantity - Maximum quantity allowed
   */
  async userAddsMaximumAllowedQuantity(productId, maxQuantity = 10) {
    await this.userAddsProductToCartWithQuantity(productId, maxQuantity);
  }

  /**
   * User adds product and verifies cart persists after reload
   * @param {number} productId - Product ID
   */
  async userAddsProductAndReloadsPage(productId) {
    // Add product
    await this.userAddsProductToCart(productId);
    
    // Get count before reload
    const countBefore = await this.addToCartPage.getCartItemCount();
    
    // Reload page
    await this.addToCartPage.page.reload();
    await this.addToCartPage.page.waitForLoadState('domcontentloaded');
    
    // Return count after reload (will be verified in assertions)
    return countBefore;
  }

  /**
   * User rapidly adds multiple products to cart
   * Simulates quick shopping behavior
   * @param {number[]} productIds - Array of product IDs
   */
  async userRapidlyAddsMultipleProducts(productIds) {
    for (const productId of productIds) {
      const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
      
      // Click without waiting for modal to fully load
      await this.addToCartPage.click(addButton);
      
      // Minimal wait
      await this.addToCartPage.page.waitForTimeout(300);
      
      // If modal is open, confirm it
      const isModalOpen = await this.addToCartPage.isAddToCartModalOpen();
      if (isModalOpen) {
        await this.addToCartPage.confirmAddToCart();
      }
    }
  }

  /**
   * User adds product with custom quantity using direct input
   * @param {number} productId - Product ID
   * @param {string} quantityValue - Quantity to type (e.g., "5")
   */
  async userTypesCustomQuantityAndAdds(productId, quantityValue) {
    const addButton = this.addToCartPage.btnAddToCartForProduct(productId);
    await this.addToCartPage.click(addButton);
    
    // Wait for modal
    await this.addToCartPage.waitForAddToCartModal();
    
    // Clear and type quantity
    const quantityInput = this.addToCartPage.quantityInputField;
    await this.addToCartPage.click(quantityInput);
    await quantityInput.fill('');
    await this.addToCartPage.fill(quantityInput, quantityValue);
    
    // Confirm
    await this.addToCartPage.confirmAddToCart();
  }
}
