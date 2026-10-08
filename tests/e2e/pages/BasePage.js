/**
 * Base Page - Parent class for all page objects
 * 
 * ✓ CLEAN ARCHITECTURE RULES:
 * - Only locators and navigation methods
 * - NO assertions, NO business logic, NO data validation
 * - NO waiting for multiple conditions
 * - Fail fast, let tests handle errors
 * 
 * Usage: extend this class, define locators, implement navigation only
 */

export class BasePage {
  constructor(page, baseURL = 'http://localhost:5173') {
    this.page = page;
    this.baseURL = baseURL;
    this.timeout = 10000;
  }

  // ==================== NAVIGATION ====================
  
  async navigate(route = '/') {
    await this.page.goto(`${this.baseURL}${route}`, { waitUntil: 'domcontentloaded' });
  }

  async reload() {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  getURL() {
    return this.page.url();
  }

  async waitForURL(urlPattern) {
    await this.page.waitForURL(urlPattern, { timeout: this.timeout });
  }

  // ==================== ELEMENT INTERACTION ====================

  async click(locator, options = {}) {
    const maxRetries = options.retries || 3;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await locator.waitFor({ state: 'visible', timeout: this.timeout });
        await locator.click({ force: options.force || false });
        return;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          await this.page.waitForTimeout(500 * (attempt + 1));
        }
      }
    }
    throw lastError;
  }

  async fill(locator, text) {
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    await locator.fill(text);
  }

  async selectOption(locator, value) {
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    await locator.selectOption(value);
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible', timeout: this.timeout });
    return locator.textContent();
  }

  async getElementCount(locator) {
    return locator.count();
  }

  async isVisible(locator) {
    try {
      return await locator.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  // ==================== WAITING & VERIFICATION ====================

  async waitForElement(locator, options = {}) {
    const timeout = options.timeout || this.timeout;
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForNavigation(action) {
    const navigationPromise = this.page.waitForNavigation();
    await action();
    await navigationPromise;
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  // ==================== UTILITIES ====================

  getTitle() {
    return this.page.title();
  }

  async screenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png` 
    });
  }
}