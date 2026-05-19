export class ProductSteps {
  constructor(productPage) { this.product = productPage; }

  async openProduct(productId) { await this.product.goto(productId); }
  async addToCart()            { await this.product.addToCart(); }

  async increaseQuantityTo(targetQty) {
    let current = await this.product.getQtyInCart();
    while (current < targetQty) {
      await this.product.incrementQty();
      current++;
    }
  }

  async navigateToCart()  { await this.product.goToCart(); }
  async goBackToShop()    { await this.product.goBack(); }
}
