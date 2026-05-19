export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '/') {
    await this.page.goto(path);
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async waitForUrl(urlPattern) {
    await this.page.waitForURL(urlPattern);
  }

  async screenshot(name) {
    await this.page.screenshot({ path: 	est-results/screenshots/.png });
  }
}