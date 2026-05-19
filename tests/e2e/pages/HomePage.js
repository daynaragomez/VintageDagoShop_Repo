import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards    = page.locator('.product-card');
    this.navbar          = page.locator('.navbar');
    this.cartLink        = page.locator('.navbar-links').getByText('Cart');
    this.cartBadge       = page.locator('.cart-badge');
    this.loadingMsg      = page.locator('.status-msg').first();
  }

  async goto() {
    await this.navigate('/');
    await this.waitForNetworkIdle();
  }

  // --- product grid ---
  async getProductCount() {
    return this.productCards.count();
  }

  async getProductName(index) {
    return this.productCards.nth(index).locator('h3').textContent();
  }

  async getProductPrice(index) {
    return this.productCards.nth(index).locator('.product-price').textContent();
  }

  async getProductStock(index) {
    return this.productCards.nth(index).locator('.product-stock').textContent();
  }

  async getAllProductNames() {
    return this.productCards.locator('h3').allTextContents();
  }

  // --- actions ---
  async addToCart(index) {
    await this.productCards.nth(index).locator('.btn-add-to-cart').click();
  }

  async viewProduct(index) {
    await this.productCards.nth(index).locator('.btn-view').click();
  }

  async isAddToCartDisabled(index) {
    return this.productCards.nth(index).locator('.btn-add-to-cart').isDisabled();
  }

  async getAddToCartLabel(index) {
    return this.productCards.nth(index).locator('.btn-add-to-cart').textContent();
  }

  // --- navbar cart ---
  async getCartBadgeCount() {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async goToCart() {
    await this.cartLink.click();
  }
}