export class HomeSteps {
  constructor(homePage) { this.home = homePage; }

  async openShop()                   { await this.home.goto(); }
  async addProductToCart(productId)  { await this.home.addToCart(productId); }
  async navigateToProduct(productId) { await this.home.viewProduct(productId); }
  async navigateToCart()             { await this.home.goToCart(); }
}
