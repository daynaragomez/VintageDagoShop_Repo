export class CheckoutSteps {
  constructor(checkoutPage) { this.checkout = checkoutPage; }

  async openCheckout()                    { await this.checkout.goto(); }
  async fillAndSubmitOrder(formData) {
    await this.checkout.submitOrder(formData);
    await this.checkout.page.waitForURL('**/confirmation');
  }
  async submitWithInvalidData(formData)   { await this.checkout.submitOrder(formData); }
}
