import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productPage  = page.getByTestId('product-page');
    this.name         = page.getByTestId('product-detail-name');
    this.price        = page.getByTestId('product-detail-price');
    this.stock        = page.getByTestId('product-detail-stock');
    this.description  = page.getByTestId('product-detail-desc');
    this.category     = page.getByTestId('product-detail-category');
    this.addToCartBtn = page.getByTestId('btn-add-to-cart');
    this.qtyControls  = page.getByTestId('qty-controls');
    this.qtyValue     = page.getByTestId('qty-value');
    this.qtyPlus      = page.getByTestId('btn-qty-plus');
    this.qtyMinus     = page.getByTestId('btn-qty-minus');
    this.viewCartBtn  = page.getByTestId('btn-view-cart');
    this.backBtn      = page.getByTestId('btn-back');
  }

  async goto(productId) {
    await this.navigate(`/product/${productId}`);
    await this.name.waitFor({ state: 'visible' });
  }

  async getName()  { return this.name.textContent(); }
  async getPrice() { return this.price.textContent(); }
  async getStock() { return this.stock.textContent(); }

  async addToCart() {
    await this.addToCartBtn.click();
    await this.qtyControls.waitFor({ state: 'visible' });
  }

  async incrementQty() {
    const current = await this.getQtyInCart();
    await this.qtyPlus.click();
    await this.page.waitForFunction(
      (prev) => {
        const el = document.querySelector('[data-testid="qty-value"]');
        return el && parseInt(el.textContent) > prev;
      },
      current
    );
  }

  async decrementQty() { await this.qtyMinus.click(); }

  async getQtyInCart() {
    const text = await this.qtyValue.textContent();
    return parseInt(text, 10);
  }

  async isPlusDisabled() { return this.qtyPlus.isDisabled(); }

  async goToCart() {
    await this.viewCartBtn.click();
    await this.page.waitForURL('**/cart');
  }

  async goBack() {
    await this.backBtn.click();
    await this.page.waitForURL('/');
  }
}
