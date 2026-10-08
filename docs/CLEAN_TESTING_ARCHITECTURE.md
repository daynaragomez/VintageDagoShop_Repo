# Clean Testing Architecture - Professional Standards

## 🎯 Principles

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility:

```
Pages          → Locators, Navigation, Element Interactions
Steps          → User Actions, Business Workflows
Assertions     → Test Verification & Expectations
Support        → API, Database, Logging Utilities
Config         → Environment Settings, Credentials
Tests          → Test Cases, Scenarios, Test Flow
```

### 2. **Clean Code in Tests**
Tests should read like business scenarios, not technical scripts:

```javascript
// ❌ BAD - Technical, hard to follow
await page.click('[data-testid="add-to-cart"]');
const badge = await page.locator('[data-testid="cart-badge"]').textContent();
expect(parseInt(badge)).toBe(1);

// ✅ GOOD - Business scenario, readable
await homeSteps.addProductToCart(1);
await homeAssertions.cartBadgeShowsCount(1);
```

### 3. **Single Responsibility**
- **Pages**: Only locators + navigation
- **Steps**: Only user actions
- **Assertions**: Only expectations
- **Support**: Only utilities

### 4. **No Cross-Cutting Logic**
Each layer focuses on its concern:

```javascript
// ❌ DON'T: Page object with assertions
class HomePage {
  async addToCart(id) {
    await this.btnAdd.click();
    expect(this.cartBadge).toBeVisible(); // ❌ NO!
  }
}

// ✅ DO: Separate concerns
class HomePage {
  btnAddToCart(id) { return this.page.locator(`[data-product-id="${id}"] .add-btn`); }
}

class HomeAssertions {
  async cartBadgeIsVisible() { 
    await expect(this.homePage.cartBadge).toBeVisible(); 
  }
}
```

---

## 📂 Architecture Layers

### **Layer 1: Pages (Page Object Model)**

**Responsibility**: Locators and navigation only

**Rules**:
- ✓ Define locators as getters/methods
- ✓ Implement navigation methods
- ✓ Use retry logic for element interactions
- ✗ No assertions
- ✗ No business logic
- ✗ No waiting for multiple conditions

**Example**:
```javascript
export class HomePage extends BasePage {
  // Locators as getters
  get cartBadge() { return this.page.locator('[data-testid="cart-badge"]'); }
  btnAddToCart(id) { return this.page.locator(`[data-product-id="${id}"] .add-btn`); }
  
  // Navigation
  async goto() { await this.navigate('/'); }
  
  // Utilities
  async getProductsCount() { return this.page.locator('[data-testid="product-card"]').count(); }
}
```

### **Layer 2: Steps (User Actions)**

**Responsibility**: Combine pages into meaningful user actions

**Rules**:
- ✓ Represent real user workflows
- ✓ Combine multiple page methods
- ✓ Use descriptive names ("addProductToCart" not "clickButton")
- ✓ Handle complete user journeys
- ✗ No assertions
- ✗ No page logic duplication
- ✗ No low-level element interaction

**Example**:
```javascript
export class HomeSteps {
  constructor(homePage) { this.homePage = homePage; }
  
  async addProductToCart(id) {
    await this.homePage.click(this.homePage.btnAddToCart(id));
  }
  
  async completeShoppingFlow(productIds) {
    await this.homePage.goto();
    for (const id of productIds) {
      await this.addProductToCart(id);
    }
  }
}
```

### **Layer 3: Assertions (Expectations)**

**Responsibility**: Verify test expectations

**Rules**:
- ✓ Descriptive method names matching business requirements
- ✓ Reusable across multiple tests
- ✓ Provide clear error messages
- ✓ Combine multiple checks when logical
- ✗ No page logic
- ✗ No navigation
- ✗ No data manipulation

**Example**:
```javascript
export class HomePageAssertions {
  constructor(homePage) { this.homePage = homePage; }
  
  async cartBadgeShowsCount(expected) {
    const badge = this.homePage.cartBadge;
    const text = await badge.textContent();
    expect(parseInt(text)).toBe(expected);
  }
  
  async productsDisplayCorrectly() {
    await expect(this.homePage.productsGrid).toBeVisible();
    const count = await this.homePage.getProductsCount();
    expect(count).toBeGreaterThan(0);
  }
}
```

### **Layer 4: Support Utilities**

#### **API Client**
```javascript
const apiClient = new ApiClient('http://localhost:3000/api');
const products = await apiClient.get('/products');
await apiClient.post('/orders', { items: [...] });
```

#### **Database Helper**
```javascript
const dbHelper = new DatabaseHelper(config.db);
await dbHelper.resetDatabase();
const product = await dbHelper.getProduct(1);
await dbHelper.createOrder({ customerId: 1, items: [...] });
```

#### **Logger**
```javascript
const logger = new Logger('HomePageTests');
logger.info('User opened shop');
logger.debug('Adding product to cart', { productId: 1 });
logger.logRequest('GET', '/api/products');
logger.logResponse('GET', '/api/products', 200, 45);
```

### **Layer 5: Configuration**

**Responsibility**: Environment-specific settings

```javascript
// environments.js
const environments = {
  dev: {
    baseURL: 'http://localhost:5173',
    apiURL: 'http://localhost:3000/api',
    db: { host: 'localhost', port: 3306, ... }
  },
  staging: {
    baseURL: 'https://staging.app.com',
    apiURL: 'https://staging.app.com/api',
    db: { ... }
  }
};
```

---

## ✅ Test File Structure

```javascript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HomeSteps } from '../steps/HomeSteps';
import { HomePageAssertions } from '../assertions/HomePageAssertions';

test.describe('Home Page @smoke @ui', () => {
  let homePage;
  let homeSteps;
  let homeAssertions;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    homeSteps = new HomeSteps(homePage);
    homeAssertions = new HomePageAssertions(homePage);
  });

  test('should display products on load', async () => {
    // GIVEN: User is on home page
    await homeSteps.openShop();
    
    // WHEN: Page loads
    // (happens during openShop)
    
    // THEN: Products are visible
    await homeAssertions.productsCountEquals(3);
    await homeAssertions.productsDisplayCorrectly();
  });

  test('should add product to cart', async () => {
    await homeSteps.openShop();
    
    // User adds first product
    await homeSteps.addFirstProductToCart();
    
    // Verify cart updated
    await homeAssertions.cartBadgeShowsCount(1);
  });
});
```

---

## 🔄 Complete Flow Example

### **Scenario**: User adds products to cart

**Test**:
```javascript
test('should add multiple products and show correct count', async () => {
  // 1. Navigate
  await homeSteps.openShop();
  
  // 2. User actions
  await homeSteps.addProductToCart(1);
  await homeSteps.addProductToCart(2);
  
  // 3. Verify
  await homeAssertions.cartBadgeShowsCount(2);
  await homeAssertions.addToCartLabelIs(1, 'Remove from Cart');
});
```

**What happens**:
1. `homeSteps.openShop()` → `HomePage.goto()` → `BasePage.navigate('/)`
2. `homeSteps.addProductToCart(1)` → `HomePage.btnAddToCart(1)` → click with retry
3. `homeAssertions.cartBadgeShowsCount(2)` → reads badge text, compares with expect()

---

## 🧪 Testing Best Practices

### **1. Arrange-Act-Assert (AAA)**
```javascript
test('should update cart total', async () => {
  // ARRANGE
  await homeSteps.openShop();
  
  // ACT
  await homeSteps.addProductToCart(1);
  
  // ASSERT
  await cartAssertions.totalPriceIs(29.99);
});
```

### **2. Use Meaningful Names**
```javascript
// ❌ Bad
test('test1', () => { ... });

// ✅ Good
test('should add product to cart and update badge count', () => { ... });
test('@smoke should display all products on home page load', () => { ... });
```

### **3. Data Isolation**
```javascript
test.beforeEach(async ({ browser }) => {
  // Reset database before each test
  await dbHelper.resetDatabase();
});

test.afterEach(async () => {
  // Cleanup
  await dbHelper.cleanup();
});
```

### **4. Handle Flakiness**
```javascript
// Use retry logic in page objects
async click(locator, options = {}) {
  const maxRetries = options.retries || 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.click();
      return;
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await this.page.waitForTimeout(500 * i);
    }
  }
}
```

### **5. Use Tags for Organization**
```javascript
// Use tags to run subsets of tests
test('@smoke should load home page', () => { ... });
test('@ui @critical should add to cart', () => { ... });
test('@regression should handle edge cases', () => { ... });

// Run: npx playwright test --grep @smoke
// Run: npx playwright test --grep @critical
```

---

## 📊 Directory Structure

```
tests/e2e/
├── pages/                     # Page Objects (locators, navigation)
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── ProductPage.js
│   └── CartPage.js
│
├── steps/                     # User Actions (workflows)
│   ├── HomeSteps.js
│   ├── CartSteps.js
│   └── CheckoutSteps.js
│
├── assertions/                # Expectations (verifications)
│   ├── HomePageAssertions.js
│   ├── CartAssertions.js
│   └── CheckoutAssertions.js
│
├── support/                   # Utilities (API, DB, Logging)
│   ├── api-client.js
│   ├── db-helper.js
│   ├── logger.js
│   └── test-data.js
│
├── config/                    # Configuration
│   └── environments.js
│
├── fixtures/                  # Test Data
│   ├── admin-credentials.md
│   └── index.js
│
├── specs/                     # Test Files
│   ├── home.spec.js
│   ├── product.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
│
└── utils/                     # Helpers
    └── helpers.js
```

---

## 🚀 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: rootsecret
          MYSQL_DATABASE: vintagedago
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run db:reset
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📋 Checklist for New Tests

- [ ] Page Object created with only locators & navigation
- [ ] Steps created for user actions
- [ ] Assertions created for verifications
- [ ] Test uses descriptive name with tags
- [ ] Test follows AAA pattern
- [ ] No assertions in page objects
- [ ] No page logic in steps
- [ ] No navigation in assertions
- [ ] Setup/teardown for data isolation
- [ ] Error messages are descriptive
- [ ] Tests can run independently
- [ ] Flaky waits replaced with explicit waits
- [ ] Database state verified with assertions
- [ ] Screenshots captured on failure

---

## 🎓 Further Reading

**Recommended Resources**:
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [BDD & Cucumber Patterns](https://cucumber.io/docs/bdd/)
- [Clean Code Principles](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
