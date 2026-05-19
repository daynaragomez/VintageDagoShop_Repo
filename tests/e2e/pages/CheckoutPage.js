import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.nameInput      = page.locator('input[name=name]');
    this.emailInput     = page.locator('input[name=email]');
    this.addressInput   = page.locator('input[name=address]');
    this.cardInput      = page.locator('input[name=card]');
    this.placeOrderBtn  = page.locator('.btn-place-order');
    this.orderItems     = page.locator('.order-item');
    this.orderTotal     = page.locator('.order-total strong').last();
    this.apiError       = page.locator('.api-error');
    this.formErrors     = page.locator('.form-error');
    this.emptyMsg       = page.locator('.checkout-empty h2');
  }

  async goto() {
    await this.navigate('/checkout');
    await this.waitForNetworkIdle();
  }

  async fillForm({ name, email, address, card }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.addressInput.fill(address);
    await this.cardInput.fill(card);
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
  }

  async submitOrder(formData) {
    await this.fillForm(formData);
    await this.placeOrder();
  }

  async getOrderTotal() {
    const text = await this.orderTotal.textContent();
    return parseFloat(text.replace('$', ''));
  }

  async getOrderItemCount() {
    return this.orderItems.count();
  }

  async hasApiError() {
    return this.apiError.isVisible();
  }

  async getApiErrorText() {
    return this.apiError.textContent();
  }

  async hasFormErrors() {
    return (await this.formErrors.count()) > 0;
  }

  async isSubmitDisabled() {
    return this.placeOrderBtn.isDisabled();
  }

  async isCartEmpty() {
    return this.emptyMsg.isVisible();
  }
}