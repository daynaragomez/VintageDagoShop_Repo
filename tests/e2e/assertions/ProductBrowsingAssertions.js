/**
 * Product Browsing Assertions
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
 * - Read like: "assert product list displays correctly"
 * - Contain the thing being verified in the method name
 * 
 * Examples:
 *   ✓ async productListDisplaysCorrectly()
 *   ✓ async productPriceIsCorrect(expectedPrice)
 *   ✗ async checkProducts() - too vague
 *   ✗ async verify() - generic
 * 
 * Rule: Method name should clearly state WHAT is being verified
 */

import { expect } from '@playwright/test';

export class ProductBrowsingAssertions {
  constructor(productBrowsingPage) {
    this.productBrowsingPage = productBrowsingPage;
    this.page = productBrowsingPage.page;
  }

  // ==================== PRODUCTS GRID ASSERTIONS ====================

  /**
   * Verify products grid is visible and loaded
   */
  async productsGridDisplaysCorrectly() {
    const grid = this.productBrowsingPage.productsGrid;
    await expect(grid).toBeVisible();
    // Verify grid has children (products)
    const count = await this.productBrowsingPage.getVisibleProductsCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify specific number of products are displayed
   * @param {number} expectedCount - Expected product count
   */
  async productsCountEqualsExpected(expectedCount) {
    const actualCount = await this.productBrowsingPage.getVisibleProductsCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Verify at least one product is displayed
   */
  async productsListIsNotEmpty() {
    const count = await this.productBrowsingPage.getVisibleProductsCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify products list shows empty state
   */
  async productsListShowsEmptyMessage() {
    const emptyMessage = this.productBrowsingPage.noResultsMessage;
    await expect(emptyMessage).toBeVisible();
  }

  // ==================== PRODUCT CARD ASSERTIONS ====================

  /**
   * Verify product name is displayed correctly
   * @param {number} productId - Product ID
   * @param {string} expectedName - Expected product name
   */
  async productNameDisplaysCorrectly(productId, expectedName) {
    const nameElement = this.productBrowsingPage.productNameByProductId(productId);
    await expect(nameElement).toContainText(expectedName);
  }

  /**
   * Verify product price is displayed
   * @param {number} productId - Product ID
   * @param {string} expectedPrice - Expected price format
   */
  async productPriceDisplaysCorrectly(productId, expectedPrice) {
    const priceElement = this.productBrowsingPage.productPriceByProductId(productId);
    await expect(priceElement).toContainText(expectedPrice);
  }

  /**
   * Verify product image is visible and loaded
   * @param {number} productId - Product ID
   */
  async productImageLoadsCorrectly(productId) {
    const imageElement = this.productBrowsingPage.productImageByProductId(productId);
    await expect(imageElement).toBeVisible();
    // Check if image has src attribute
    const src = await imageElement.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src.length).toBeGreaterThan(0);
  }

  /**
   * Verify product shows as in stock
   * @param {number} productId - Product ID
   */
  async productShowsAsInStock(productId) {
    const isOutOfStock = await this.productBrowsingPage.isProductOutOfStock(productId);
    expect(isOutOfStock).toBeFalsy();
  }

  /**
   * Verify product shows as out of stock
   * @param {number} productId - Product ID
   */
  async productShowsAsOutOfStock(productId) {
    const isOutOfStock = await this.productBrowsingPage.isProductOutOfStock(productId);
    expect(isOutOfStock).toBeTruthy();
  }

  /**
   * Verify product has visible rating
   * @param {number} productId - Product ID
   */
  async productDisplaysRating(productId) {
    const ratingElement = this.productBrowsingPage.productRatingByProductId(productId);
    await expect(ratingElement).toBeVisible();
  }

  /**
   * Verify add to cart button is enabled for product
   * @param {number} productId - Product ID
   */
  async addToCartButtonIsEnabledForProduct(productId) {
    const addButton = this.productBrowsingPage.btnAddToCartByProductId(productId);
    await expect(addButton).toBeEnabled();
  }

  /**
   * Verify add to cart button is disabled for product
   * @param {number} productId - Product ID
   */
  async addToCartButtonIsDisabledForProduct(productId) {
    const addButton = this.productBrowsingPage.btnAddToCartByProductId(productId);
    await expect(addButton).toBeDisabled();
  }

  /**
   * Verify view details button is visible and clickable
   * @param {number} productId - Product ID
   */
  async viewDetailsButtonIsAvailableForProduct(productId) {
    const viewButton = this.productBrowsingPage.btnViewProductDetailsByProductId(productId);
    await expect(viewButton).toBeVisible();
    await expect(viewButton).toBeEnabled();
  }

  // ==================== SEARCH ASSERTIONS ====================

  /**
   * Verify search box is visible and ready
   */
  async searchBoxIsAvailable() {
    const searchInput = this.productBrowsingPage.searchInputField;
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
  }

  /**
   * Verify search results are filtered correctly
   * @param {string} searchTerm - Search term that was used
   */
  async searchResultsContainProductName(searchTerm) {
    const productNames = await this.productBrowsingPage.getAllVisibleProductNames();
    const hasMatch = productNames.some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(hasMatch).toBeTruthy();
  }

  // ==================== FILTER ASSERTIONS ====================

  /**
   * Verify filter panel is visible
   */
  async filterPanelIsVisible() {
    const filterPanel = this.productBrowsingPage.filterSidebarPanel;
    await expect(filterPanel).toBeVisible();
  }

  /**
   * Verify filter panel is hidden
   */
  async filterPanelIsHidden() {
    const filterPanel = this.productBrowsingPage.filterSidebarPanel;
    await expect(filterPanel).not.toBeVisible();
  }

  /**
   * Verify category filter checkbox is visible
   * @param {string} categoryName - Category name
   */
  async categoryFilterIsAvailable(categoryName) {
    const checkbox = this.productBrowsingPage.filterCheckboxByCategory(categoryName);
    await expect(checkbox).toBeVisible();
  }

  /**
   * Verify active filters are present
   */
  async activeFiltersAreApplied() {
    const hasFilters = await this.productBrowsingPage.hasActiveFilters();
    expect(hasFilters).toBeTruthy();
  }

  /**
   * Verify no filters are currently applied
   */
  async noFiltersAreApplied() {
    const hasFilters = await this.productBrowsingPage.hasActiveFilters();
    expect(hasFilters).toBeFalsy();
  }

  /**
   * Verify clear filters button is visible
   */
  async clearFiltersButtonIsVisible() {
    const clearButton = this.productBrowsingPage.btnClearFilters();
    await expect(clearButton).toBeVisible();
  }

  // ==================== SORT ASSERTIONS ====================

  /**
   * Verify sort selector is available
   */
  async sortSelectorIsAvailable() {
    const sortSelect = this.productBrowsingPage.sortBySelect;
    await expect(sortSelect).toBeVisible();
  }

  /**
   * Verify current sort option matches expected
   * @param {string} expectedSortOption - Expected sort option
   */
  async currentSortOptionIs(expectedSortOption) {
    const currentSort = await this.productBrowsingPage.getCurrentSortOption();
    expect(currentSort).toContain(expectedSortOption);
  }

  /**
   * Verify products are sorted by price (low to high)
   */
  async productsAreSortedByPriceAscending() {
    const prices = [];
    const productIds = await this.productBrowsingPage.getAllVisibleProductIds();
    
    for (const productId of productIds) {
      const priceText = await this.productBrowsingPage.getProductPriceText(productId);
      // Parse price - remove currency symbols and convert to number
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      prices.push(price);
    }
    
    // Check if array is sorted in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  }

  /**
   * Verify products are sorted by price (high to low)
   */
  async productsAreSortedByPriceDescending() {
    const prices = [];
    const productIds = await this.productBrowsingPage.getAllVisibleProductIds();
    
    for (const productId of productIds) {
      const priceText = await this.productBrowsingPage.getProductPriceText(productId);
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      prices.push(price);
    }
    
    // Check if array is sorted in descending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  }

  // ==================== PAGINATION ASSERTIONS ====================

  /**
   * Verify pagination controls are visible
   */
  async paginationControlsAreVisible() {
    const infoText = this.productBrowsingPage.paginationInfoText;
    await expect(infoText).toBeVisible();
  }

  /**
   * Verify next page button is enabled
   */
  async nextPageButtonIsEnabled() {
    const nextButton = this.productBrowsingPage.btnPaginationNext();
    await expect(nextButton).toBeEnabled();
  }

  /**
   * Verify next page button is disabled
   */
  async nextPageButtonIsDisabled() {
    const nextButton = this.productBrowsingPage.btnPaginationNext();
    await expect(nextButton).toBeDisabled();
  }

  /**
   * Verify previous page button is enabled
   */
  async previousPageButtonIsEnabled() {
    const prevButton = this.productBrowsingPage.btnPaginationPrevious();
    await expect(prevButton).toBeEnabled();
  }

  /**
   * Verify previous page button is disabled
   */
  async previousPageButtonIsDisabled() {
    const prevButton = this.productBrowsingPage.btnPaginationPrevious();
    await expect(prevButton).toBeDisabled();
  }

  // ==================== LOADING STATE ASSERTIONS ====================

  /**
   * Verify loading spinner is visible
   */
  async loadingSpinnerIsVisible() {
    const spinner = this.productBrowsingPage.loadingSpinner;
    await expect(spinner).toBeVisible();
  }

  /**
   * Verify loading spinner is gone (content loaded)
   */
  async loadingSpinnerIsHidden() {
    const spinner = this.productBrowsingPage.loadingSpinner;
    await expect(spinner).not.toBeVisible();
  }

  // ==================== ERROR STATE ASSERTIONS ====================

  /**
   * Verify error message is displayed
   */
  async errorMessageIsDisplayed() {
    const errorContainer = this.productBrowsingPage.errorMessageContainer;
    await expect(errorContainer).toBeVisible();
  }

  /**
   * Verify error message is not displayed
   */
  async errorMessageIsNotDisplayed() {
    const errorContainer = this.productBrowsingPage.errorMessageContainer;
    await expect(errorContainer).not.toBeVisible();
  }
}
