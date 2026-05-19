import { expect } from '@playwright/test';

export class CheckoutAssertions {
  constructor(checkoutPage) { this.checkout = checkoutPage; }

  async formIsVisible()               { await expect(this.checkout.checkoutForm).toBeVisible(); }
  async orderItemCountIs(expected)    { expect(await this.checkout.getOrderItemCount()).toBe(expected); }
  async orderTotalIsCloseTo(expected) { expect(await this.checkout.getOrderTotal()).toBeCloseTo(expected, 1); }
  async nameErrorVisible()            { await expect(this.checkout.errorName).toBeVisible(); }
  async emailErrorVisible()           { await expect(this.checkout.errorEmail).toBeVisible(); }
  async cardErrorVisible()            { await expect(this.checkout.errorCard).toBeVisible(); }
  async apiErrorVisible()             { await expect(this.checkout.apiError).toBeVisible(); }
  async cartIsEmpty()                 { await expect(this.checkout.checkoutEmpty).toBeVisible(); }
}
