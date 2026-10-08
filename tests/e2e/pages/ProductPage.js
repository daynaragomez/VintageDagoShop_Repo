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
    // Wait for button to be visible
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 5000 });
    
    // Wait a bit for any pending updates
    await this.page.waitForTimeout(500);
    
    // Click the button (retry if it fails due to disabled state)
    let clicked = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.addToCartBtn.click({ timeout: 2000 });
        clicked = true;
        break;
      } catch (e) {
        if (attempt < 2 && e.message.includes('not enabled')) {
          // Wait a bit and retry
          await this.page.waitForTimeout(1000);
          continue;
        }
        throw e;
      }
    }
    
    if (!clicked) {
      throw new Error('Failed to click Add to Cart button after 3 attempts');
    }
    
    // Wait for quantity controls to appear
    await this.qtyControls.waitFor({ state: 'visible', timeout: 5000 });
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
