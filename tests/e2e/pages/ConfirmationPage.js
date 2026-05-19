import { BasePage } from './BasePage.js';

export class ConfirmationPage extends BasePage {
  constructor(page) {
    super(page);
    this.confirmationPage = page.getByTestId('confirmation-page');
    this.heading          = page.getByTestId('confirmation-heading');
    this.message          = page.getByTestId('confirmation-message');
    this.icon             = page.getByTestId('confirmation-icon');
    this.btnShopAgain     = page.getByTestId('btn-shop-again');
  }

  async goto() {
    await this.navigate('/confirmation');
    await this.confirmationPage.waitFor({ state: 'visible' });
  }

  async getHeadingText() { return this.heading.textContent(); }
  async isVisible()      { return this.confirmationPage.isVisible(); }

  async shopAgain() {
    await this.btnShopAgain.click();
    await this.page.waitForURL('/');
  }
}
