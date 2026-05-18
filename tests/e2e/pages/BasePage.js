export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '/') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    return this.page.locator(selector).textContent();
  }

  async isVisible(selector) {
    return this.page.locator(selector).isVisible();
  }
}
