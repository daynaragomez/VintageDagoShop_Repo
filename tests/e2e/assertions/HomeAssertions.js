import { expect } from '@playwright/test';

export class HomeAssertions {
  constructor(homePage) { this.home = homePage; }

  async navbarIsVisible()                           { await expect(this.home.navbar).toBeVisible(); }
  async productCountIs(expected)                    { expect(await this.home.getProductCount()).toBe(expected); }
  async productNamesInclude(names) {
    const actual = await this.home.getAllProductNames();
    for (const name of names) expect(actual).toContain(name);
  }
  async cartBadgeCountIs(expected)                  { expect(await this.home.getCartBadgeCount()).toBe(expected); }
  async cartBadgeNotVisible()                       { await expect(this.home.cartBadge).not.toBeVisible(); }
  async addToCartButtonIsEnabled(productId)         { await expect(this.home.btnAddToCart(productId)).toBeEnabled(); }
  async addToCartButtonIsDisabled(productId)        { await expect(this.home.btnAddToCart(productId)).toBeDisabled(); }
  async addToCartLabelContains(productId, text)     { await expect(this.home.btnAddToCart(productId)).toContainText(text); }
  async stockLabelIs(productId, text)               { await expect(this.home.productStock(productId)).toContainText(text); }
}
