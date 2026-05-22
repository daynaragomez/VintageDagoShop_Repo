import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkoutPage  = page.getByTestId('checkout-page');
    this.checkoutForm  = page.getByTestId('checkout-form');
    this.inputName     = page.getByTestId('input-name');
    this.inputEmail    = page.getByTestId('input-email');
    this.inputPhone    = page.getByTestId('input-phone');
    this.inputStreet   = page.getByTestId('input-street');
    this.inputCity     = page.getByTestId('input-city');
    this.inputState    = page.getByTestId('input-state');
    this.inputZip      = page.getByTestId('input-zip');
    this.inputCountry  = page.getByTestId('input-country');
    this.inputCard     = page.getByTestId('input-card');
    this.btnPlaceOrder = page.getByTestId('btn-place-order');
    this.apiError      = page.getByTestId('api-error');
    this.errorName     = page.getByTestId('error-name');
    this.errorEmail    = page.getByTestId('error-email');
    this.errorStreet   = page.getByTestId('error-street');
    this.errorCity     = page.getByTestId('error-city');
    this.errorCountry  = page.getByTestId('error-country');
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

  async fillForm({ name, email, phone, street, city, state, zipCode, country, card }) {
    await this.inputName.fill(name);
    await this.inputEmail.fill(email);
    if (phone)   await this.inputPhone.fill(phone);
    await this.inputStreet.fill(street);
    await this.inputCity.fill(city);
    if (state)   await this.inputState.fill(state);
    if (zipCode) await this.inputZip.fill(zipCode);
    await this.inputCountry.fill(country);
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
