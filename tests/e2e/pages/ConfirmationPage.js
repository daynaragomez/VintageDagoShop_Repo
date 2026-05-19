import { BasePage } from './BasePage.js';

export class ConfirmationPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading      = page.locator('.confirmation-page h1, .confirmation-page h2').first();
    this.shopAgainBtn = page.locator('.btn-shop-again, .btn-back-shop');
  }

  async goto() {
    await this.navigate('/confirmation');
    await this.waitForNetworkIdle();
  }

  async getHeadingText() {
    return this.heading.textContent();
  }

  async isVisible() {
    return this.heading.isVisible();
  }

  async shopAgain() {
    await this.shopAgainBtn.click();
  }
}