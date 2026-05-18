# Testing Strategy - VintageDagoShop

## Stack

| Layer | Tool |
|-------|------|
| Unit & Integration | Vitest + React Testing Library |
| Component | Vitest + React Testing Library |
| E2E | Playwright |

## Folder Structure

```
tests/
+-- setup.js
+-- unit/
¦   +-- context/
¦   ¦   +-- CartContext.test.jsx
¦   +-- components/
¦       +-- HomePage.test.jsx
+-- integration/
¦   +-- cart-flow.test.jsx
+-- e2e/
    +-- pages/
    ¦   +-- BasePage.js
    ¦   +-- HomePage.js
    ¦   +-- ProductPage.js
    ¦   +-- CartPage.js
    ¦   +-- CheckoutPage.js
    +-- specs/
        +-- home.spec.js
        +-- cart.spec.js
        +-- checkout.spec.js
```

## Page Object Model

E2E tests use the POM pattern. Each page class extends BasePage and encapsulates selectors and interactions for that page.

```javascript
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
  }

  async getItemCount() {
    return this.cartItems.count();
  }
}
```

Specs import page objects and never use raw selectors directly:

```javascript
import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';

test('cart is empty on load', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.goto();
  expect(await cartPage.isCartVisible()).toBe(false);
});
```

## Commands

```bash
npm test                  # run unit + integration (Vitest)
npm run test:ui           # Vitest UI
npm run test:coverage     # coverage report
npx playwright test       # run E2E tests
npx playwright test --ui  # Playwright UI mode
npx playwright show-report
```

## Coverage Targets

| Layer | Target |
|-------|--------|
| Unit | > 80% |
| Integration | > 70% |
| E2E | critical user flows |

## Rules

- Unit tests cover context logic, reducers, and helpers in isolation.
- Integration tests render the full component tree and exercise real user interactions.
- E2E tests use Page Objects only — no raw selectors in spec files.
- Each test is independent; use eforeEach to reset state.
- Test observable behavior, not implementation details.
