export class CartSteps {
  constructor(cartPage) { this.cart = cartPage; }

  async openCart()                   { await this.cart.goto(); }
  async removeProduct(productId)     { await this.cart.removeItem(productId); }
  async increaseItemQty(productId)   { await this.cart.incrementItem(productId); }
  async proceedToCheckout()          { await this.cart.proceedToCheckout(); }
  async continueShopping()           { await this.cart.continueShopping(); }
}
