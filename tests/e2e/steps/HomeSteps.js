/**
 * Home Page Steps - User Actions
 * 
 * ✓ CLEAN ARCHITECTURE:
 * - Meaningful user actions (not low-level clicks)
 * - Readable as business scenarios
 * - Reusable across multiple tests
 * - Combines page methods into workflows
 * 
 * Rule: Step methods should be at the business action level
 * Example: "User adds product to cart" not "User clicks add button"
 */

export class HomeSteps {
  constructor(homePage) {
    this.homePage = homePage;
  }

  /**
   * User opens the shop
   */
  async openShop() {
    await this.homePage.goto();
  }

  /**
   * User adds product to cart by ID
   */
  async addProductToCart(productId) {
    const button = this.homePage.btnAddToCart(productId);
    await this.homePage.click(button);
  }

  /**
   * User adds the first product (ID=1)
   */
  async addFirstProductToCart() {
    await this.addProductToCart(1);
  }

  /**
   * User navigates to product details page
   */
  async navigateToProduct(productId) {
    const viewButton = this.homePage.btnView(productId);
    await this.homePage.click(viewButton);
  }

  /**
   * User navigates to cart page
   */
  async navigateToCart() {
    const cartLink = this.homePage.navCart;
    await this.homePage.click(cartLink);
  }

  /**
   * User searches for a product
   */
  async searchProduct(productName) {
    const searchInput = this.homePage.searchInput;
    await this.homePage.fill(searchInput, productName);
    await this.homePage.page.keyboard.press('Enter');
  }

  /**
   * User filters by category
   */
  async filterByCategory(category) {
    const filter = this.homePage.categoryFilter;
    await this.homePage.selectOption(filter, category);
  }
}
