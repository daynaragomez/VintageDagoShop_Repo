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
    const maxRetries = 3;
    
    // Wait for button to be visible
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 5000 });
    
    // Wait for button to be enabled (not disabled)
    try {
      await this.page.waitForFunction(
        () => {
          const btn = document.querySelector('[data-testid="btn-add-to-cart"]');
          return btn && !btn.disabled;
        },
        { timeout: 5000 }
      );
    } catch (e) {
      console.warn('Button did not become enabled within 5s, will retry on click');
    }
    
    // Click the button with retry logic
    let clicked = false;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.addToCartBtn.click({ timeout: 2000 });
        clicked = true;
        console.log(`✓ Add to cart clicked (attempt ${attempt + 1})`);
        break;
      } catch (e) {
        if (attempt < maxRetries - 1 && e.message.includes('not enabled')) {
          // Exponential backoff: 1s, 2s, 4s
          const backoffMs = 1000 * Math.pow(2, attempt);
          console.warn(`⚠ Retry ${attempt + 1}/${maxRetries}: Button not enabled, waiting ${backoffMs}ms...`);
          await this.page.waitForTimeout(backoffMs);
          continue;
        }
        throw new Error(
          `Failed to click Add to Cart after ${attempt + 1} attempt(s): ${e.message}`
        );
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
