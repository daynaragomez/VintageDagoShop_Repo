import { expect } from '@playwright/test';

export class ProductAssertions {
  constructor(productPage) { this.product = productPage; }

  async nameIs(expected)             { await expect(this.product.name).toContainText(expected); }
  async priceContains(expected)      { await expect(this.product.price).toContainText(expected); }
  async stockContains(text)          { await expect(this.product.stock).toContainText(text); }
  async addToCartButtonVisible()     { await expect(this.product.addToCartBtn).toBeVisible(); }
  async qtyControlsVisible()         { await expect(this.product.qtyControls).toBeVisible(); }
  async qtyInCartIs(expected)        { expect(await this.product.getQtyInCart()).toBe(expected); }
  async plusButtonIsDisabled()       { await expect(this.product.qtyPlus).toBeDisabled(); }
  async plusButtonIsEnabled()        { await expect(this.product.qtyPlus).toBeEnabled(); }
}
