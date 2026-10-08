/**
 * Product Browsing Page Object
 * 
 * ✓ PURPOSE: Encapsulates all locators and navigation for product browsing/listing
 * ✓ CLEAN ARCHITECTURE: Only locators and basic navigation methods
 * ✓ NO ASSERTIONS: All verifications are in ProductBrowsingAssertions.js
 * ✓ NO BUSINESS LOGIC: All user actions are in ProductBrowsingSteps.js
 * 
 * Naming Convention:
 * - Locators: get{ElementName} or {action}{ElementName}(params)
 * - Methods: async {action}{Description}()
 * 
 * Examples:
 *   btnAddToCart(productId)    ✓ Specific action + element
 *   productCard(productId)     ✓ Element locator with parameter
 *   getProductsCount()         ✓ Getter method returning value
 */

import { BasePage } from './BasePage.js';

export class ProductBrowsingPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Grid and Container Locators
    this.productsGrid          = page.getByTestId('products-grid');
    this.productsContainer     = page.getByTestId('products-container');
    this.loadingSpinner        = page.getByTestId('loading-spinner');
    this.errorMessageContainer = page.getByTestId('error-message');
    this.noResultsMessage      = page.getByText(/No products found/i);
    
    // Search/Filter Locators
    this.searchInputField      = page.getByTestId('search-input');
    this.btnSearchSubmit       = page.getByTestId('btn-search-submit');
    this.filterSidebarPanel    = page.getByTestId('filter-sidebar');
    this.sortBySelect          = page.getByTestId('sort-by-select');
  }

  // ==================== PRODUCT CARD LOCATORS ====================
  
  /**
   * Get product card container by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Product card element
   */
  productCard(productId) {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  /**
   * Get product name element by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Product name element
   */
  productNameByProductId(productId) {
    return this.page.getByTestId(`product-name-${productId}`);
  }

  /**
   * Get product price element by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Product price element
   */
  productPriceByProductId(productId) {
    return this.page.getByTestId(`product-price-${productId}`);
  }

  /**
   * Get product image element by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Product image element
   */
  productImageByProductId(productId) {
    return this.page.getByTestId(`product-image-${productId}`);
  }

  /**
   * Get stock status/availability indicator by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Stock status element
   */
  productStockIndicatorByProductId(productId) {
    return this.page.getByTestId(`product-stock-${productId}`);
  }

  /**
   * Get "Add to Cart" button by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Add to cart button
   */
  btnAddToCartByProductId(productId) {
    return this.page.getByTestId(`btn-add-to-cart-${productId}`);
  }

  /**
   * Get "View Details" button by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} View details button
   */
  btnViewProductDetailsByProductId(productId) {
    return this.page.getByTestId(`btn-view-${productId}`);
  }

  /**
   * Get product rating display by product ID
   * @param {number} productId - Product ID
   * @returns {Locator} Rating element (e.g., "4.5 stars")
   */
  productRatingByProductId(productId) {
    return this.page.getByTestId(`product-rating-${productId}`);
  }

  // ==================== FILTER LOCATORS ====================

  /**
   * Get filter panel open/close button
   * @returns {Locator} Filter toggle button
   */
  btnToggleFilterPanel() {
    return this.page.getByTestId('btn-toggle-filters');
  }

  /**
   * Get category filter checkbox
   * @param {string} categoryName - Category name (e.g., "Clothing", "Accessories")
   * @returns {Locator} Category checkbox
   */
  filterCheckboxByCategory(categoryName) {
    return this.page.getByTestId(`filter-category-${categoryName.toLowerCase()}`);
  }

  /**
   * Get price range slider minimum input
   * @returns {Locator} Min price input
   */
  get filterPriceMinInput() {
    return this.page.getByTestId('filter-price-min');
  }

  /**
   * Get price range slider maximum input
   * @returns {Locator} Max price input
   */
  get filterPriceMaxInput() {
    return this.page.getByTestId('filter-price-max');
  }

  /**
   * Get "Apply Filters" button
   * @returns {Locator} Apply filters button
   */
  btnApplyFilters() {
    return this.page.getByTestId('btn-apply-filters');
  }

  /**
   * Get "Clear Filters" button
   * @returns {Locator} Clear filters button
   */
  btnClearFilters() {
    return this.page.getByTestId('btn-clear-filters');
  }

  // ==================== SORT LOCATORS ====================

  /**
   * Get sort option by name
   * @param {string} sortOption - Sort option (e.g., "Relevance", "Price: Low to High", "Newest")
   * @returns {Locator} Sort option element
   */
  sortOptionByName(sortOption) {
    return this.page.getByTestId(`sort-option-${sortOption.toLowerCase()}`);
  }

  // ==================== PAGINATION LOCATORS ====================

  /**
   * Get pagination next button
   * @returns {Locator} Next page button
   */
  btnPaginationNext() {
    return this.page.getByTestId('btn-pagination-next');
  }

  /**
   * Get pagination previous button
   * @returns {Locator} Previous page button
   */
  btnPaginationPrevious() {
    return this.page.getByTestId('btn-pagination-previous');
  }

  /**
   * Get specific page number button
   * @param {number} pageNumber - Page number
   * @returns {Locator} Page number button
   */
  btnPaginationPageNumber(pageNumber) {
    return this.page.getByTestId(`btn-pagination-page-${pageNumber}`);
  }

  /**
   * Get pagination info text (e.g., "Page 1 of 5")
   * @returns {Locator} Pagination info element
   */
  get paginationInfoText() {
    return this.page.getByTestId('pagination-info');
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to products listing page
   * Waits for products grid to load
   */
  async goto() {
    await this.navigate('/shop');
    // Wait for products grid to load with at least one product
    await this.waitForElement(this.productsGrid);
    // Wait for at least one product card to appear
    await this.waitForElement(this.productCard(1));
  }

  /**
   * Navigate to products listing by category
   * @param {string} categorySlug - Category URL slug (e.g., "clothing", "accessories")
   */
  async gotoCategory(categorySlug) {
    await this.navigate(`/shop/category/${categorySlug}`);
    await this.waitForElement(this.productsGrid);
  }

  // ==================== RETRIEVAL METHODS ====================

  /**
   * Get total count of visible products on current page
   * @returns {Promise<number>} Count of visible product cards
   */
  async getVisibleProductsCount() {
    const cards = await this.page.locator('[data-testid^="product-card-"]').count();
    return cards;
  }

  /**
   * Get product name text by product ID
   * @param {number} productId - Product ID
   * @returns {Promise<string>} Product name text
   */
  async getProductNameText(productId) {
    const nameElement = this.productNameByProductId(productId);
    return await nameElement.textContent();
  }

  /**
   * Get product price text by product ID
   * @param {number} productId - Product ID
   * @returns {Promise<string>} Product price text (e.g., "$99.99")
   */
  async getProductPriceText(productId) {
    const priceElement = this.productPriceByProductId(productId);
    return await priceElement.textContent();
  }

  /**
   * Get all visible product IDs on current page
   * @returns {Promise<number[]>} Array of product IDs
   */
  async getAllVisibleProductIds() {
    const cards = await this.page.locator('[data-testid^="product-card-"]').all();
    const ids = [];
    for (const card of cards) {
      const testId = await card.getAttribute('data-testid');
      const id = testId.match(/\d+/)?.[0];
      if (id) ids.push(parseInt(id));
    }
    return ids;
  }

  /**
   * Get all visible product names on current page
   * @returns {Promise<string[]>} Array of product names
   */
  async getAllVisibleProductNames() {
    const names = await this.page.locator('[data-testid^="product-name-"]').allTextContents();
    return names.map(name => name.trim());
  }

  /**
   * Check if product is out of stock
   * @param {number} productId - Product ID
   * @returns {Promise<boolean>} True if out of stock
   */
  async isProductOutOfStock(productId) {
    const stockIndicator = this.productStockIndicatorByProductId(productId);
    const text = await stockIndicator.textContent();
    return text.toLowerCase().includes('out of stock');
  }

  /**
   * Get current sort selection
   * @returns {Promise<string>} Current sort option text
   */
  async getCurrentSortOption() {
    const sortSelect = this.sortBySelect;
    return await sortSelect.textContent();
  }

  /**
   * Check if filters are currently applied
   * @returns {Promise<boolean>} True if any filters are active
   */
  async hasActiveFilters() {
    const clearButton = this.btnClearFilters();
    return await clearButton.isVisible().catch(() => false);
  }
}
