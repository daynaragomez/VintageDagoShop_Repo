import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator('.product-card');
    this.productsGrid = page.locator('.products-grid');
    this.sectionTitle = page.locator('main h2');
  }

  async goto() {
    await this.navigate('/');
  }

  async getAllProductNames() {
    return this.productCards.locator('h3').allTextContents();
  }

  async getAllProductPrices() {
    return this.productCards.locator('.product-price').allTextContents();
  }

  async getStockText(index) {
    return this.productCards.nth(index).locator('.product-stock').textContent();
  }

  async getDescriptionText(index) {
    return this.productCards.nth(index).locator('.product-description').textContent();
  }

  async getQuantityInCart(index) {
    const badge = this.productCards.nth(index).locator('.quantity-badge');
    const visible = await badge.isVisible();
    if (!visible) return 0;
    const text = await badge.textContent();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async clickAddToCart(index) {
    await this.productCards.nth(index).locator('.btn-add-to-cart').click();
  }
}
