import { expect } from '@playwright/test';

export class ConfirmationAssertions {
  constructor(confirmationPage, page) {
    this.confirmation = confirmationPage;
    this.page = page;
  }

  async pageIsVisible()        { await expect(this.confirmation.confirmationPage).toBeVisible(); }
  async headingIsConfirmed()   { await expect(this.confirmation.heading).toContainText('Order Confirmed'); }
  async urlIsConfirmation()    { await expect(this.page).toHaveURL('/confirmation'); }
  async iconIsVisible()        { await expect(this.confirmation.icon).toBeVisible(); }
  async summaryIsVisible()     { await expect(this.confirmation.summary).toBeVisible(); }
  async orderIdIsDisplayed()   { await expect(this.confirmation.orderIdValue).not.toBeEmpty(); }
  async totalIsCloseTo(expected) {
    const text = await this.confirmation.totalValue.textContent();
    expect(parseFloat(text.replace('$', ''))).toBeCloseTo(expected, 1);
  }
}
