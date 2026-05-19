import { expect } from '@playwright/test';

export class CartAssertions {
  constructor(cartPage) { this.cart = cartPage; }

  async cartIsEmpty()                            { await expect(this.cart.cartEmpty).toBeVisible(); }
  async cartIsNotEmpty()                         { await expect(this.cart.cartEmpty).not.toBeVisible(); await expect(this.cart.cartItemsList).toBeVisible(); }
  async itemCountIs(expected)                    { expect(await this.cart.getItemCount()).toBe(expected); }
  async itemNameIs(productId, expected)          { await expect(this.cart.itemName(productId)).toContainText(expected); }
  async itemQtyIs(productId, expected)           { expect(await this.cart.getItemQtyValue(productId)).toBe(expected); }
  async totalIsCloseTo(expected)                 { expect(await this.cart.getOrderTotal()).toBeCloseTo(expected, 1); }
  async plusButtonIsDisabled(productId)          { await expect(this.cart.btnQtyPlus(productId)).toBeDisabled(); }
}
