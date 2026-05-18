import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.header = page.locator('header.header');
    this.pageTitle = page.locator('header h1');
    this.cartCount = page.locator('.cart-icon span').first();
    this.cartTotal = page.locator('.cart-total');
    this.productCards = page.locator('.product-card');
    this.cartSummary = page.locator('.cart-summary');
    this.cartItems = page.locator('.cart-item');
    this.cartTotalSection = page.locator('.cart-total-section strong');
  }

  async goto() {
    await this.navigate('/');
  }

  async getProductCount() {
    return this.productCards.count();
  }

  async getProductCard(index) {
    return this.productCards.nth(index);
  }

  async addProductToCart(index) {
    const card = this.productCards.nth(index);
    await card.locator('.btn-add-to-cart').click();
  }

  async removeCartItem(index) {
    await this.cartItems.nth(index).locator('.btn-remove').click();
  }

  async getCartCountText() {
    return this.cartCount.textContent();
  }

  async getCartTotalText() {
    return this.cartTotal.textContent();
  }

  async getCartSummaryTotal() {
    return this.cartTotalSection.textContent();
  }

  async isCartSummaryVisible() {
    return this.cartSummary.isVisible();
  }

  async getProductName(index) {
    return this.productCards.nth(index).locator('h3').textContent();
  }

  async getProductPrice(index) {
    return this.productCards.nth(index).locator('.product-price').textContent();
  }

  async isAddToCartDisabled(index) {
    return this.productCards.nth(index).locator('.btn-add-to-cart').isDisabled();
  }
}
