import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartPage       = page.getByTestId('cart-page');
    this.cartEmpty      = page.getByTestId('cart-empty');
    this.cartEmptyMsg   = page.getByTestId('cart-empty-msg');
    this.cartItemsList  = page.getByTestId('cart-items-list');
    this.summaryPanel   = page.getByTestId('cart-summary-panel');
    this.cartTotalValue = page.getByTestId('cart-total-value');
    this.btnCheckout    = page.getByTestId('btn-checkout');
    this.btnContinue    = page.getByTestId('btn-continue-shopping');
    this.btnBrowse      = page.getByTestId('btn-browse');
  }

  cartRow(id)      { return this.page.getByTestId(`cart-row-${id}`); }
  itemName(id)     { return this.page.getByTestId(`cart-item-name-${id}`); }
  itemQty(id)      { return this.page.getByTestId(`cart-item-qty-${id}`); }
  itemSubtotal(id) { return this.page.getByTestId(`cart-item-subtotal-${id}`); }
  btnQtyPlus(id)   { return this.page.getByTestId(`btn-qty-plus-${id}`); }
  btnQtyMinus(id)  { return this.page.getByTestId(`btn-qty-minus-${id}`); }
  btnRemove(id)    { return this.page.getByTestId(`btn-remove-${id}`); }

  async goto() {
    await this.navigate('/cart');
    await this.cartPage.waitFor({ state: 'visible' });
  }

  async isEmpty()      { return this.cartEmpty.isVisible(); }
  async getItemCount() { return this.page.locator('[data-testid^="cart-row-"]').count(); }

  async getOrderTotal() {
    const text = await this.cartTotalValue.textContent();
    return parseFloat(text.replace('$', ''));
  }

  async removeItem(productId) {
    const rowCount = await this.getItemCount();
    await this.btnRemove(productId).click();
    await this.page.waitForFunction(
      (prev) => document.querySelectorAll('[data-testid^="cart-row-"]').length < prev,
      rowCount
    );
  }

  async incrementItem(productId) {
    const current = await this.getItemQtyValue(productId);
    await this.btnQtyPlus(productId).click();
    await this.page.waitForFunction(
      ({ tid, prev }) => {
        const el = document.querySelector(`[data-testid="cart-item-qty-${tid}"]`);
        return el && parseInt(el.textContent) > prev;
      },
      { tid: productId, prev: current }
    );
  }

  async getItemQtyValue(productId) {
    const text = await this.itemQty(productId).textContent();
    return parseInt(text, 10);
  }

  async isPlusDisabled(productId) { return this.btnQtyPlus(productId).isDisabled(); }

  async proceedToCheckout() {
    await this.btnCheckout.click();
    await this.page.waitForURL('**/checkout');
  }

  async continueShopping() {
    await this.btnContinue.click();
    await this.page.waitForURL('/');
  }
}
