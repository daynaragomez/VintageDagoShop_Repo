import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName    = page.locator('.product-detail-name');
    this.productPrice   = page.locator('.product-detail-price');
    this.productStock   = page.locator('.product-detail-stock');
    this.productDesc    = page.locator('.product-detail-desc');
    this.addToCartBtn   = page.locator('.btn-add-to-cart-detail');
    this.qtyControls    = page.locator('.detail-qty-controls');
    this.qtyValue       = page.locator('.qty-value');
    this.qtyPlus        = page.locator('.detail-qty-controls .btn-qty').last();
    this.qtyMinus       = page.locator('.detail-qty-controls .btn-qty').first();
    this.viewCartBtn    = page.locator('.btn-go-cart');
    this.backBtn        = page.locator('.btn-back');
  }

  async goto(productId) {
    await this.navigate(/product/);
    await this.waitForNetworkIdle();
  }

  async getName() {
    return this.productName.textContent();
  }

  async getPrice() {
    return this.productPrice.textContent();
  }

  async getStock() {
    return this.productStock.textContent();
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async incrementQty() {
    await this.qtyPlus.click();
  }

  async decrementQty() {
    await this.qtyMinus.click();
  }

  async getQtyInCart() {
    const text = await this.qtyValue.textContent();
    return parseInt(text, 10);
  }

  async isPlusDisabled() {
    return this.qtyPlus.isDisabled();
  }

  async goToCart() {
    await this.viewCartBtn.click();
  }

  async goBack() {
    await this.backBtn.click();
  }
}