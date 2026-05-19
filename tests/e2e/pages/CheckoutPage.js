import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkoutPage  = page.getByTestId('checkout-page');
    this.checkoutForm  = page.getByTestId('checkout-form');
    this.inputName     = page.getByTestId('input-name');
    this.inputEmail    = page.getByTestId('input-email');
    this.inputAddress  = page.getByTestId('input-address');
    this.inputCard     = page.getByTestId('input-card');
    this.btnPlaceOrder = page.getByTestId('btn-place-order');
    this.apiError      = page.getByTestId('api-error');
    this.errorName     = page.getByTestId('error-name');
    this.errorEmail    = page.getByTestId('error-email');
    this.errorAddress  = page.getByTestId('error-address');
    this.errorCard     = page.getByTestId('error-card');
    this.orderSummary  = page.getByTestId('order-summary');
    this.orderTotal    = page.getByTestId('order-total-value');
    this.checkoutEmpty = page.getByTestId('checkout-empty');
  }

  orderItem(id) { return this.page.getByTestId(`order-item-${id}`); }

  async goto() {
    await this.navigate('/checkout');
    await this.checkoutPage.waitFor({ state: 'visible' });
  }

  async fillForm({ name, email, address, card }) {
    await this.inputName.fill(name);
    await this.inputEmail.fill(email);
    await this.inputAddress.fill(address);
    await this.inputCard.fill(card);
  }

  async submitOrder(formData) {
    await this.fillForm(formData);
    await this.btnPlaceOrder.click();
  }

  async getOrderTotal() {
    const text = await this.orderTotal.textContent();
    return parseFloat(text.replace('$', ''));
  }

  async getOrderItemCount() {
    return this.page.locator('[data-testid^="order-item-"]').count();
  }

  async isCartEmpty() { return this.checkoutEmpty.isVisible(); }
}
