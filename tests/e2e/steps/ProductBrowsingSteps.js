/**
 * Product Browsing Steps - User Actions/Workflows
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
 *   ✓ userSearchesForProductByName(productName)
 *   ✗ searchProducts() - too generic
 *   ✗ typeSearchTerm() - too technical
 * 
 * Rule: Readable like "User searches for product by name"
 */

export class ProductBrowsingSteps {
  constructor(productBrowsingPage) {
    this.productBrowsingPage = productBrowsingPage;
  }

  /**
   * User navigates to the product listing page
   */
  async userNavigatesToProductListing() {
    await this.productBrowsingPage.goto();
  }

  /**
   * User navigates to a specific product category
   * @param {string} categoryName - Category name (e.g., "Clothing", "Accessories")
   */
  async userNavigatesToProductCategory(categoryName) {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    await this.productBrowsingPage.gotoCategory(categorySlug);
  }

  /**
   * User searches for a product by name
   * @param {string} searchTerm - Product name or keyword to search
   */
  async userSearchesForProductByName(searchTerm) {
    const searchInput = this.productBrowsingPage.searchInputField;
    await this.productBrowsingPage.click(searchInput);
    await this.productBrowsingPage.fill(searchInput, searchTerm);
    
    const submitButton = this.productBrowsingPage.btnSearchSubmit();
    await this.productBrowsingPage.click(submitButton);
    
    // Wait for results to update
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User scrolls through the products listing
   */
  async userScrollsThroughProductsList() {
    const container = this.productBrowsingPage.productsContainer;
    await container.scrollIntoViewIfNeeded();
    // Scroll down to simulate browsing
    await this.productBrowsingPage.page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    // Wait for any lazy-loaded images
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User filters products by category
   * @param {string} categoryName - Category to filter by
   */
  async userFiltersProductsByCategory(categoryName) {
    const checkbox = this.productBrowsingPage.filterCheckboxByCategory(categoryName);
    await this.productBrowsingPage.click(checkbox);
    
    const applyButton = this.productBrowsingPage.btnApplyFilters();
    await this.productBrowsingPage.click(applyButton);
    
    // Wait for filtered results to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User filters products by price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   */
  async userFiltersProductsByPriceRange(minPrice, maxPrice) {
    const minInput = this.productBrowsingPage.filterPriceMinInput;
    const maxInput = this.productBrowsingPage.filterPriceMaxInput;
    
    // Clear and set min price
    await this.productBrowsingPage.click(minInput);
    await minInput.fill('');
    await this.productBrowsingPage.fill(minInput, minPrice.toString());
    
    // Clear and set max price
    await this.productBrowsingPage.click(maxInput);
    await maxInput.fill('');
    await this.productBrowsingPage.fill(maxInput, maxPrice.toString());
    
    const applyButton = this.productBrowsingPage.btnApplyFilters();
    await this.productBrowsingPage.click(applyButton);
    
    // Wait for filtered results to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User clears all active filters
   */
  async userClearsAllFilters() {
    const clearButton = this.productBrowsingPage.btnClearFilters();
    await this.productBrowsingPage.click(clearButton);
    
    // Wait for results to reload
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User sorts products by a specific option
   * @param {string} sortOption - Sort option (e.g., "Price: Low to High", "Newest", "Relevance")
   */
  async userSortsProductsBy(sortOption) {
    const selectOption = this.productBrowsingPage.sortOptionByName(sortOption);
    await this.productBrowsingPage.click(selectOption);
    
    // Wait for sorted results to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User views product details by clicking on product card
   * @param {number} productId - Product ID to view
   */
  async userViewsProductDetails(productId) {
    const viewButton = this.productBrowsingPage.btnViewProductDetailsByProductId(productId);
    await this.productBrowsingPage.click(viewButton);
    
    // Wait for navigation to product detail page
    await this.productBrowsingPage.page.waitForLoadState('domcontentloaded');
  }

  /**
   * User adds product to cart directly from listing
   * @param {number} productId - Product ID to add
   */
  async userAddsProductToCartFromListing(productId) {
    const addButton = this.productBrowsingPage.btnAddToCartByProductId(productId);
    await this.productBrowsingPage.click(addButton);
    
    // Wait for cart update to complete
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User navigates to next page of products
   */
  async userNavigatesToNextProductPage() {
    const nextButton = this.productBrowsingPage.btnPaginationNext();
    await this.productBrowsingPage.click(nextButton);
    
    // Wait for next page to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User navigates to previous page of products
   */
  async userNavigatesToPreviousProductPage() {
    const prevButton = this.productBrowsingPage.btnPaginationPrevious();
    await this.productBrowsingPage.click(prevButton);
    
    // Wait for previous page to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User navigates to specific page number
   * @param {number} pageNumber - Page number to navigate to
   */
  async userNavigatesToProductPage(pageNumber) {
    const pageButton = this.productBrowsingPage.btnPaginationPageNumber(pageNumber);
    await this.productBrowsingPage.click(pageButton);
    
    // Wait for page to load
    await this.productBrowsingPage.page.waitForLoadState('networkidle');
  }

  /**
   * User opens the filter panel (on mobile/responsive layouts)
   */
  async userOpensFilterPanel() {
    const toggleButton = this.productBrowsingPage.btnToggleFilterPanel();
    await this.productBrowsingPage.click(toggleButton);
    
    // Wait for panel to animate open
    const filterPanel = this.productBrowsingPage.filterSidebarPanel;
    await this.productBrowsingPage.waitForElement(filterPanel);
  }

  /**
   * User combines multiple filters and searches
   * @param {string} searchTerm - Product name/keyword
   * @param {string} categoryName - Category to filter
   * @param {number} minPrice - Min price
   * @param {number} maxPrice - Max price
   */
  async userSearchesWithFiltersAndCategory(searchTerm, categoryName, minPrice, maxPrice) {
    await this.userSearchesForProductByName(searchTerm);
    await this.userFiltersProductsByCategory(categoryName);
    await this.userFiltersProductsByPriceRange(minPrice, maxPrice);
  }
}
