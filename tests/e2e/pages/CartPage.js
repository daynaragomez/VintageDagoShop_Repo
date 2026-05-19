import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartRows        = page.locator('.cart-row');
    this.emptyMsg        = page.locator('.cart-empty h2');
    this.orderTotal      = page.locator('.summary-total strong').last();
    this.checkoutBtn     = page.locator('.btn-checkout');
    this.continueBtn     = page.locator('.btn-continue-shopping');
    this.browseBtn       = page.locator('.btn-shop');
  }

  async goto() {
    await this.navigate('/cart');
    await this.waitForNetworkIdle();
  }

  async isEmpty() {
    return this.emptyMsg.isVisible();
  }

  async getItemCount() {
    return this.cartRows.count();
  }

  async getItemName(index) {
    return this.cartRows.nth(index).locator('h3').textContent();
  }

  async getItemQty(index) {
    const text = await this.cartRows.nth(index).locator('.cart-row-qty span').textContent();
    return parseInt(text, 10);
  }

  async getItemSubtotal(index) {
    const text = await this.cartRows.nth(index).locator('.cart-row-subtotal').textContent();
    return parseFloat(text.replace('$', ''));
  }

  async getOrderTotal() {
    const text = await this.orderTotal.textContent();
    return parseFloat(text.replace('$', ''));
  }

  async incrementItem(index) {
    await this.cartRows.nth(index).locator('.btn-qty').last().click();
  }

  async decrementItem(index) {
    await this.cartRows.nth(index).locator('.btn-qty').first().click();
  }

  async isPlusDisabled(index) {
    return this.cartRows.nth(index).locator('.btn-qty').last().isDisabled();
  }

  async removeItem(index) {
    await this.cartRows.nth(index).locator('.btn-remove').click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async continueShopping() {
    await this.continueBtn.click();
  }

  async browseShopping() {
    await this.browseBtn.click();
  }
}