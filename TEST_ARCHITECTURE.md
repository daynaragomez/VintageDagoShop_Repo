# Testing Architecture - VintageDagoShop

## 📋 Estructura Layered (Capas)

```
tests/
├── e2e/                          # End-to-End Tests (Playwright)
│   ├── pages/                    # Page Object Models
│   ├── steps/                    # Step Definitions (BDD)
│   ├── fixtures/                 # Fixtures y Setup
│   ├── specs/                    # Test Specifications
│   ├── support/
│   │   ├── api-client.js         # API Client Utilities
│   │   ├── db-helper.js          # Database Helpers
│   │   ├── assertions.js         # Custom Assertions
│   │   └── logger.js             # Logging Utility
│   └── config/
│       ├── environments.js       # Environment Configuration
│       └── test-config.js        # Test Settings
│
├── integration/                  # Integration Tests (Node.js + API)
│   ├── api-tests.js              # API Endpoint Tests
│   ├── db-integration.test.js    # Database Integration
│   └── fixtures/
│
├── unit/                         # Unit Tests
│   ├── components/
│   ├── services/
│   └── utils/
│
├── csharp/                       # C# NUnit Tests (Optional)
│   ├── Pages/                    # Page Objects (C#)
│   ├── Tests/                    # Test Classes
│   ├── Support/
│   │   ├── ApiClient.cs
│   │   ├── DatabaseHelper.cs
│   │   └── ConfigManager.cs
│   └── VintageDagoShop.Tests.csproj
│
├── docker/                       # Docker for Test Execution
│   ├── Dockerfile.test
│   └── docker-compose.test.yml
│
├── ci-cd/                        # CI/CD Pipeline Configuration
│   ├── .github/workflows/
│   │   └── test-automation.yml
│   └── jenkins/
│       └── Jenkinsfile
│
└── reports/                      # Test Reports
    ├── html/
    ├── junit/
    └── screenshots/
```

---

## 🏗️ Capas de Testing (Clean Architecture)

### 1. **Presentation Layer** (Pages)
- Page Object Models (POM)
- UI Element Locators
- Page Navigation Methods
- No assertions, no business logic

### 2. **Steps/Actions Layer**
- User interactions
- Step definitions (Given, When, Then)
- Combination of page methods
- No assertions

### 3. **Assertions Layer**
- Expected result verification
- Custom assertion methods
- Readable assertion messages

### 4. **Support/Utilities Layer**
- API Clients
- Database Helpers
- Configuration Management
- Logging & Reporting

### 5. **Configuration Layer**
- Environment settings
- Test data
- Timeouts & Retries
- Browser options

---

## 📊 Test Labels & Tags

```javascript
// Smoke Tests - Critical functionality (run on every build)
@smoke @critical

// Functional Tests - Feature verification
@functional @ui @api

// Regression Tests - Prevent past bugs
@regression

// Performance Tests - Load & response time
@performance

// Security Tests - Authentication & authorization
@security

// Boundary Tests - Edge cases
@boundary

// Environment-specific
@dev @staging @prod
```

---

## ✅ Test Writing Standards

### ❌ BAD - Mixed responsibilities
```javascript
test('user adds product to cart', async ({ page }) => {
  await page.goto('/');
  const product = page.locator('.product-card').first();
  expect(product).toBeVisible();
  await product.click();
  expect(page.url()).toContain('/product');
  // ... 50+ lines of mixed concerns
});
```

### ✅ GOOD - Clean separation
```javascript
test('user can add product to cart @smoke @cart', async ({ homePage, cartSteps, assertions }) => {
  // GIVEN - Setup
  await homePage.goto();
  
  // WHEN - Actions
  await cartSteps.addFirstProductToCart();
  
  // THEN - Assertions
  await assertions.cartBadgeShowsCount(1);
  await assertions.productShowsAsInCart();
});
```

---

## 🔧 Implementation Standards

### Page Object Model
- One page = One class
- Only getters and navigation methods
- No assertions, no waits, no data validation
- Descriptive method names

### Step Definitions
- Combine page methods into user flows
- Represent business actions
- Bridge between tests and pages
- Readable as plain English

### Assertions
- Separate assertion class per page
- Custom assertion methods
- Descriptive error messages
- Reusable across tests

### API Client
- Centralized HTTP requests
- Request/response interceptors
- Error handling & retries
- Request logging

### Database Helper
- Transaction-based operations
- Data cleanup & reset
- Query builders
- Connection pooling

---

## 🌍 Environment Configuration

```javascript
// environments.js
module.exports = {
  dev: {
    baseURL: 'http://localhost:5173',
    apiURL: 'http://localhost:3000/api',
    db: { host: 'localhost', port: 3306 },
    timeout: 30000,
    screenshots: 'only-on-failure'
  },
  staging: {
    baseURL: 'https://staging.vintagedago.com',
    apiURL: 'https://staging-api.vintagedago.com',
    db: { host: 'staging-db', port: 3306 },
    timeout: 45000,
    screenshots: 'on-failure'
  },
  prod: {
    baseURL: 'https://vintagedago.com',
    apiURL: 'https://api.vintagedago.com',
    db: { host: 'prod-db', port: 3306 },
    timeout: 60000,
    screenshots: 'never'
  }
};
```

---

## 🐳 Docker Execution

```yaml
# docker-compose.test.yml
version: '3.9'
services:
  playwright-tests:
    build:
      context: .
      dockerfile: docker/Dockerfile.test
    environment:
      NODE_ENV: test
      BASE_URL: http://frontend:5173
      API_URL: http://backend:3000/api
    depends_on:
      - mysql
      - backend
      - frontend
    volumes:
      - ./test-results:/app/test-results
      - ./reports:/app/reports
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Test Automation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: docker-compose -f docker-compose.test.yml up -d
      - run: npm run test:unit
      - run: npm run test:e2e:smoke
      - run: npm run test:e2e:full
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

## 📋 Test Naming Convention

```javascript
// ✓ GOOD
test('user can add in-stock product to cart @smoke @cart @functional', async () => {})
test('cart total updates correctly when adding multiple items @functional @cart', async () => {})
test('checkout fails with invalid email @validation @boundary @functional', async () => {})

// ✗ BAD
test('test 1', async () => {})
test('add to cart', async () => {})
test('checkout validation', async () => {})
```

---

## 📊 Reporting Standards

- **HTML Report**: Detailed results with screenshots
- **JUnit XML**: CI/CD integration (Jenkins, GitHub Actions)
- **JSON**: Custom processing & dashboards
- **Screenshots**: Only failures (or configurable)
- **Video**: Failures only (configurable)
- **Logs**: Detailed for debugging

---

## 🚀 Execution Examples

```bash
# Smoke tests
npm run test:e2e:smoke

# Full E2E suite
npm run test:e2e:full

# Specific tag
npx playwright test --grep @cart

# Environment-specific
ENV=staging npm run test:e2e:smoke

# With reporting
npx playwright test --reporter=html --reporter=junit

# Via Docker
docker-compose -f docker-compose.test.yml run tests
```

---

## ✨ Key Principles

1. **Readability**: Tests read like business requirements
2. **Maintainability**: Changes in one place (pages) don't break tests
3. **Reusability**: Steps & assertions shared across tests
4. **Scalability**: Easy to add new pages, steps, assertions
5. **Reliability**: Deterministic, no flaky tests
6. **Performance**: Fast feedback on failures
7. **Traceability**: Clear labels and documentation
8. **Isolation**: Tests independent, can run in any order
