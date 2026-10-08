/**
 * Home Page Assertions
 * 
 * ✓ CLEAN ARCHITECTURE:
 * - Separate from page objects
 * - Only assertion methods
 * - Descriptive assertion names matching business requirements
 * - Reusable across all tests
 * 
 * Usage:
 *   const assertions = new HomePageAssertions(homePage);
 *   await assertions.cartBadgeShowsCount(1);
 *   await assertions.productDisplaysName('Vintage Leather Jacket');
 */

import { expect } from '@playwright/test';

export class HomePageAssertions {
  constructor(homePage) {
    this.homePage = homePage;
    this.page = homePage.page;
  }

  // ==================== NAVBAR ASSERTIONS ====================

  async navbarIsVisible() {
    await expect(this.homePage.navbar).toBeVisible();
  }

  async navLinkExists(linkName) {
    const link = this.page.getByRole('link', { name: new RegExp(linkName, 'i') });
    await expect(link).toBeVisible();
  }

  async cartBadgeShowsCount(expectedCount) {
    const badge = this.homePage.cartBadge;
    const text = await badge.textContent();
    expect(parseInt(text)).toBe(expectedCount);
  }

  async cartBadgeIsHidden() {
    await expect(this.homePage.cartBadge).not.toBeVisible();
  }

  // ==================== PRODUCT GRID ASSERTIONS ====================

  async productsGridIsVisible() {
    await expect(this.homePage.productsGrid).toBeVisible();
  }

  async productsCountEquals(expectedCount) {
    const count = await this.homePage.getProductsCount();
    expect(count).toBe(expectedCount);
  }

  async productDisplaysName(productName) {
    const product = this.page.locator(`text=${productName}`);
    await expect(product).toBeVisible();
  }

  async productDisplaysPrice(productId, expectedPrice) {
    const price = this.homePage.productPrice(productId);
    const text = await price.textContent();
    expect(text).toContain(expectedPrice);
  }

  async productHasAddToCartButton(productId) {
    const button = this.homePage.btnAddToCart(productId);
    await expect(button).toBeVisible();
  }

  async addToCartButtonIsEnabled(productId) {
    const button = this.homePage.btnAddToCart(productId);
    await expect(button).toBeEnabled();
  }

  async addToCartButtonIsDisabled(productId) {
    const button = this.homePage.btnAddToCart(productId);
    await expect(button).toBeDisabled();
  }

  async addToCartLabelIs(productId, expectedLabel) {
    const button = this.homePage.btnAddToCart(productId);
    const text = await button.textContent();
    expect(text.trim()).toBe(expectedLabel);
  }

  // ==================== NAVIGATION ASSERTIONS ====================

  async urlIs(expectedPath) {
    const url = this.homePage.getURL();
    expect(url).toContain(expectedPath);
  }

  async viewDetailsButtonIsVisible(productId) {
    const button = this.homePage.btnView(productId);
    await expect(button).toBeVisible();
  }

  // ==================== STATE ASSERTIONS ====================

  async cartIsEmpty() {
    await this.cartBadgeIsHidden();
  }

  async pageHasTitle(title) {
    const pageTitle = await this.homePage.getTitle();
    expect(pageTitle).toContain(title);
  }
}

module.exports = HomePageAssertions;
