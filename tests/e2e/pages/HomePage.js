import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navbar       = page.getByTestId('navbar');
    this.navShop      = page.getByTestId('nav-shop');
    this.navCart      = page.getByTestId('nav-cart');
    this.cartBadge    = page.getByTestId('cart-badge');
    this.navCartTotal = page.getByTestId('navbar-cart-total');
    this.productsGrid = page.getByTestId('products-grid');
    this.errorMessage = page.getByText(/Could not load products/);
  }

  productCard(id)  { return this.page.getByTestId(`product-card-${id}`); }
  productName(id)  { return this.page.getByTestId(`product-name-${id}`); }
  productPrice(id) { return this.page.getByTestId(`product-price-${id}`); }
  productStock(id) { return this.page.getByTestId(`product-stock-${id}`); }
  btnAddToCart(id) { return this.page.getByTestId(`btn-add-to-cart-${id}`); }
  btnView(id)      { return this.page.getByTestId(`btn-view-${id}`); }

  async goto() {
    await this.navigate('/');
    
    // Use waitForFunction with explicit retry logic to avoid race conditions
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Check if products grid has loaded with at least one product
        await this.page.waitForFunction(
          () => {
            const grid = document.querySelector('[data-testid="products-grid"]');
            return grid && grid.children && grid.children.length > 0;
          },
          { timeout: 15000 }
        );
        // Success - grid loaded with products
        return;
      } catch (e) {
        lastError = e;
        
        // Check if error message appeared (API failure)
        const errorMsg = await this.page.$('[data-testid*="error"]');
        if (errorMsg) {
          throw new Error('API returned error - products failed to load');
        }
        
        // If we haven't exceeded max retries, reload and try again
        if (attempt < maxRetries - 1) {
          console.warn(`HomePage.goto() retry ${attempt + 1}/${maxRetries}: ${e.message}`);
          await this.page.reload();
          // Wait a bit before retry
          await this.page.waitForTimeout(500);
        }
      }
    }
    
    // All retries exhausted
    throw new Error(
      `HomePage failed to load products after ${maxRetries} attempts. ` +
      `Last error: ${lastError?.message || 'Unknown'}`
    );
  }

  async getProductCount() {
    return this.page.locator('[data-testid^="product-card-"]').count();
  }

  async getAllProductNames() {
    return this.page.locator('[data-testid^="product-name-"]').allTextContents();
  }

  async addToCart(productId) {
    await this.btnAddToCart(productId).click();
    await this.btnAddToCart(productId).waitFor({ state: 'visible' });
  }

  async viewProduct(productId) {
    await this.btnView(productId).click();
  }

  async getCartBadgeCount() {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async getNavCartTotal() {
    return this.navCartTotal.textContent();
  }

  async goToCart()  { await this.navCart.click(); }
  async goToShop()  { await this.navShop.click(); }
}
