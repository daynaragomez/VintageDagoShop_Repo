import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartSummary = page.locator('.cart-summary');
    this.cartItems = page.locator('.cart-item');
    this.cartTotalSection = page.locator('.cart-total-section strong');
    this.cartIcon = page.locator('.cart-icon');
  }

  async goto() {
    await this.navigate('/');
  }

  async isCartVisible() {
    return this.cartSummary.isVisible();
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async getItemText(index) {
    return this.cartItems.nth(index).locator('span').first().textContent();
  }

  async getItemSubtotal(index) {
    return this.cartItems.nth(index).locator('span').last().textContent();
  }

  async removeItem(index) {
    await this.cartItems.nth(index).locator('.btn-remove').click();
  }

  async getTotalText() {
    return this.cartTotalSection.textContent();
  }

  async getCartIconCount() {
    return this.cartIcon.locator('span').first().textContent();
  }

  async getCartIconTotal() {
    return this.cartIcon.locator('.cart-total').textContent();
  }
}
