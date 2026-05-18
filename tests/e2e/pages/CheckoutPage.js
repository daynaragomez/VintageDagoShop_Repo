import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartSummary = page.locator('.cart-summary');
    this.cartItems = page.locator('.cart-item');
    this.totalDisplay = page.locator('.cart-total-section strong');
  }

  async goto() {
    await this.navigate('/');
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async getOrderTotal() {
    const text = await this.totalDisplay.textContent();
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async verifyItemInCart(productName) {
    const items = await this.cartItems.allTextContents();
    return items.some((text) => text.includes(productName));
  }
}
