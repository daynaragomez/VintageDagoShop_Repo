# Testing Architecture Guide

Complete guide to the professional testing framework for VintageDago Shop.

## 📚 Quick Navigation

- **[Architecture Overview](#architecture-overview)** - High-level design
- **[Getting Started](#getting-started)** - Setup and first test
- **[Writing Tests](#writing-tests)** - Creating new tests
- **[Running Tests](#running-tests)** - Execution commands
- **[CI/CD](#cicd)** - Automated testing pipeline
- **[Best Practices](#best-practices)** - Recommendations
- **[Troubleshooting](#troubleshooting)** - Common issues

---

## Architecture Overview

### Clean Layered Design

```
┌─────────────────────────────────────────┐
│         TEST FILES (.spec.js)           │  ← What we test
├─────────────────────────────────────────┤
│      STEPS (HomeSteps, CartSteps)       │  ← What users do
├─────────────────────────────────────────┤
│    ASSERTIONS (HomePageAssertions)      │  ← What we verify
├─────────────────────────────────────────┤
│     PAGES (HomePage, CartPage)          │  ← Where users interact
├─────────────────────────────────────────┤
│  SUPPORT (ApiClient, DbHelper, Logger)  │  ← Tools & utilities
├─────────────────────────────────────────┤
│  CONFIG (environments.js)               │  ← Settings
└─────────────────────────────────────────┘
```

Each layer has **single responsibility**:
- **Pages**: Locators + Navigation only
- **Steps**: User actions + workflows
- **Assertions**: Expectations + verification
- **Support**: API, Database, Logging
- **Config**: Environment settings

See [CLEAN_TESTING_ARCHITECTURE.md](./CLEAN_TESTING_ARCHITECTURE.md) for detailed patterns.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

```bash
docker-compose up -d
```

Verify services are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api/health
- Database: localhost:3306

### 3. Reset Database

```bash
npm run db:reset
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run only E2E tests
npm run test:e2e

# Run only unit tests
npm run test:unit

# Run only smoke tests
npm run test:e2e:smoke
```

---

## Writing Tests

### Basic Test Structure

```javascript
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HomeSteps } from '../steps/HomeSteps';
import { HomePageAssertions } from '../assertions/HomePageAssertions';

test.describe('Home Page @smoke @ui', () => {
  let homePage;
  let homeSteps;
  let homeAssertions;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    homeSteps = new HomeSteps(homePage);
    homeAssertions = new HomePageAssertions(homePage);
    
    // Reset database
    await dbHelper.resetDatabase();
  });

  test('should display products on load', async () => {
    // Arrange
    await homeSteps.openShop();
    
    // Assert
    await homeAssertions.productsCountEquals(3);
  });

  test('should add product to cart', async () => {
    // Arrange
    await homeSteps.openShop();
    
    // Act
    await homeSteps.addProductToCart(1);
    
    // Assert
    await homeAssertions.cartBadgeShowsCount(1);
  });
});
```

### Creating a New Page Object

**File**: `tests/e2e/pages/ProductPage.js`

```javascript
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Locators
  get productTitle() {
    return this.page.locator('[data-testid="product-title"]');
  }

  get productPrice() {
    return this.page.locator('[data-testid="product-price"]');
  }

  btnAddToCart() {
    return this.page.locator('[data-testid="add-to-cart"]');
  }

  // Navigation
  async gotoProduct(productId) {
    await this.navigate(`/product/${productId}`);
  }

  // Utilities
  async getProductTitle() {
    return this.getText(this.productTitle);
  }
}
```

### Creating Step Definitions

**File**: `tests/e2e/steps/ProductSteps.js`

```javascript
export class ProductSteps {
  constructor(productPage) {
    this.productPage = productPage;
  }

  // User actions
  async viewProductDetails(productId) {
    await this.productPage.gotoProduct(productId);
  }

  async addProductToCart() {
    await this.productPage.click(this.productPage.btnAddToCart());
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.productPage.click(this.productPage.btnIncrease());
    }
  }
}
```

### Creating Assertions

**File**: `tests/e2e/assertions/ProductPageAssertions.js`

```javascript
import { expect } from '@playwright/test';

export class ProductPageAssertions {
  constructor(productPage) {
    this.productPage = productPage;
  }

  async titleIs(expectedTitle) {
    const title = await this.productPage.getProductTitle();
    expect(title).toBe(expectedTitle);
  }

  async priceIs(expectedPrice) {
    const price = await this.productPage.getText(this.productPage.productPrice);
    expect(price).toContain(expectedPrice);
  }

  async addToCartButtonIsEnabled() {
    const button = this.productPage.btnAddToCart();
    await expect(button).toBeEnabled();
  }
}
```

---

## Running Tests

### Local Development

```bash
# Watch mode (auto-rerun on changes)
npm run test:e2e -- --watch

# Debug mode (open browser)
npm run test:e2e -- --debug

# Specific test file
npm run test:e2e -- tests/e2e/specs/home.spec.js

# Specific test
npm run test:e2e -- -g "should add product to cart"
```

### By Tag

```bash
# Run only smoke tests
npm run test:e2e -- --grep @smoke

# Run only UI tests
npm run test:e2e -- --grep @ui

# Run everything except slow tests
npm run test:e2e -- --grep-invert @slow
```

### Docker

```bash
# Run tests in container
docker-compose -f docker-compose.test.yml up

# Run specific test in container
docker-compose -f docker-compose.test.yml run playwright npx playwright test home.spec.js
```

---

## CI/CD

### GitHub Actions Pipeline

Tests run automatically on:
- Push to `master` or `develop`
- Pull requests
- Daily schedule (2 AM UTC)

**Pipeline stages**:
1. **Unit Tests** (fast feedback) → ~30s
2. **E2E Smoke Tests** (quick integration) → ~1 min
3. **Full E2E Tests** (comprehensive) → ~5 min
4. **Coverage Report** (code quality)
5. **Test Results** (reporting)

**View results**:
- GitHub Actions: Settings → Actions
- Artifacts: Downloaded after run
- Playwright Report: `playwright-report/index.html`

---

## Best Practices

### ✅ DO

- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange-Act-Assert)
- ✅ Use tags for test categorization
- ✅ Keep page objects simple (only locators)
- ✅ Use steps for user workflows
- ✅ Reset database before each test
- ✅ Use explicit waits, not sleep()
- ✅ Take screenshots on failure
- ✅ Log important actions

### ❌ DON'T

- ❌ Put assertions in page objects
- ❌ Hardcode wait times (use waitFor)
- ❌ Share state between tests
- ❌ Use generic test names ("test1", "test2")
- ❌ Click before element is visible
- ❌ Mix technical details with business logic
- ❌ Test multiple concerns in one test
- ❌ Use flaky selectors (prefer data-testid)

### Code Examples

**✅ Good Test**:
```javascript
test('should add multiple products and calculate total correctly', async () => {
  // Setup
  const productIds = [1, 2, 3];
  await dbHelper.resetDatabase();
  
  // User adds products
  await homeSteps.openShop();
  await homeSteps.addMultipleProductsToCart(productIds);
  
  // Verify state
  await cartAssertions.itemCountIs(3);
  await cartAssertions.totalPriceIs(89.97);
});
```

**❌ Bad Test**:
```javascript
test('test shopping flow', async () => {
  // No clear intent
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000); // Magic number!
  await page.click('[class*="btn"]'); // Flaky selector
  const text = await page.textContent('[class*="badge"]');
  expect(text).toBe('1'); // Unclear what we're testing
});
```

---

## Troubleshooting

### Tests Timeout

**Problem**: "Timeout waiting for element"

**Solutions**:
```javascript
// 1. Increase timeout
await homePage.waitForElement(locator, { timeout: 20000 });

// 2. Use explicit wait for condition
await page.waitForFunction(() => {
  return document.querySelector('[data-testid="badge"]').textContent === '1';
}, { timeout: 10000 });

// 3. Check if element exists first
if (await homePage.isVisible(locator)) {
  // ...
}
```

### Tests Fail Intermittently (Flaky)

**Problem**: Test passes sometimes, fails other times

**Solutions**:
```javascript
// ❌ DON'T: Sleep
await page.waitForTimeout(2000);

// ✅ DO: Wait for element
await page.locator('[data-testid="cart-badge"]').waitFor({ state: 'visible' });

// ✅ DO: Wait for specific condition
await page.waitForFunction(
  () => parseInt(document.querySelector('[data-testid="cart-badge"]').textContent) > 0,
  { timeout: 5000 }
);

// ✅ DO: Use retry logic
await homePage.click(button, { retries: 3 });
```

### Database Errors

**Problem**: "Access denied" or "Connection failed"

**Solutions**:
```bash
# 1. Restart Docker
docker-compose down --remove-orphans
docker-compose up -d

# 2. Reset database
npm run db:reset

# 3. Check MySQL is ready
docker-compose logs mysql

# 4. Verify connection
npm run db:test
```

### Tests Pass Locally but Fail in CI

**Problem**: Different environment

**Solutions**:
1. Check environment variables in CI
2. Verify database is initialized
3. Check backend is started
4. Use `CI=true` to match CI settings
5. Check Docker versions match

---

## Test Organization

### By Feature

```
tests/e2e/
├── home/
│   ├── pages/HomePage.js
│   ├── steps/HomeSteps.js
│   ├── assertions/HomePageAssertions.js
│   └── specs/home.spec.js
├── product/
│   ├── pages/ProductPage.js
│   ├── steps/ProductSteps.js
│   └── specs/product.spec.js
└── checkout/
    ├── pages/CheckoutPage.js
    └── specs/checkout.spec.js
```

### By Test Type

```
tests/
├── unit/          # Component unit tests
├── integration/   # Backend API integration
└── e2e/           # Full workflow tests
    ├── smoke/
    ├── regression/
    ├── performance/
    └── security/
```

---

## Performance Metrics

**Target Times**:
- Unit tests: < 1 min
- Smoke tests: < 2 min
- Full E2E: < 10 min
- CI pipeline: < 15 min total

**Monitor performance**:
```bash
npm run test:e2e -- --reporter=line
npm run test:e2e -- --reporter=html

# Open report
open playwright-report/index.html
```

---

## Resources

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Page Objects**: https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/
- **BDD Pattern**: https://cucumber.io/docs/bdd/
- **Clean Code**: https://www.oreilly.com/library/view/clean-code-a/9780136083238/

---

## Support

For questions or issues:
1. Check [CLEAN_TESTING_ARCHITECTURE.md](./CLEAN_TESTING_ARCHITECTURE.md)
2. Review test examples in `tests/e2e/specs/`
3. Check Playwright documentation
4. Create an issue in the repository

---

**Last Updated**: 2024
**Testing Framework**: Playwright + Vitest
**Node Version**: 18+
