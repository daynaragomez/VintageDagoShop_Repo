import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.navbar       = page.getByTestId('navbar');
    this.navShop      = page.getByTestId('nav-shop');
    this.navCart      = page.getByTestId('nav-cart');
    this.cartBadge    = page.getByTestId('cart-badge');
    this.navCartTotal = page.getByTestId('navbar-cart-total');
    this.productsGrid = page.getByTestId('products-grid');
  }

  productCard(id)  { return this.page.getByTestId(`product-card-${id}`); }
  productName(id)  { return this.page.getByTestId(`product-name-${id}`); }
  productPrice(id) { return this.page.getByTestId(`product-price-${id}`); }
  productStock(id) { return this.page.getByTestId(`product-stock-${id}`); }
  btnAddToCart(id) { return this.page.getByTestId(`btn-add-to-cart-${id}`); }
  btnView(id)      { return this.page.getByTestId(`btn-view-${id}`); }

  async goto() {
    await this.navigate('/');
    await this.productsGrid.waitFor({ state: 'visible' });
  }

  async getProductCount() {
    return this.page.locator('[data-testid^="product-card-"]').count();
  }

  async getAllProductNames() {
    return this.page.locator('[data-testid^="product-name-"]').allTextContents();
  }

  async addToCart(productId) {
    await this.btnAddToCart(productId).click();
    await this.btnAddToCart(productId).waitFor({ state: 'visible' });
  }

  async viewProduct(productId) {
    await this.btnView(productId).click();
  }

  async getCartBadgeCount() {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async getNavCartTotal() {
    return this.navCartTotal.textContent();
  }

  async goToCart()  { await this.navCart.click(); }
  async goToShop()  { await this.navShop.click(); }
}
