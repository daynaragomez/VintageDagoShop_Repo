# 📁 Folder Structure Expansion Plan - VintageDagoShop

## 📊 Current Structure (IMPLEMENTED ✅)

```
VintageDagoShop/
├── tests/
│   ├── e2e/                    ✅ (DO NOT CHANGE)
│   │   ├── pages/              ✅ HomePage, ProductPage, etc.
│   │   ├── steps/              ✅ HomeSteps, ProductSteps, etc.
│   │   ├── assertions/         ✅ HomeAssertions, etc.
│   │   ├── specs/              ✅ home.spec.js, product.spec.js, etc.
│   │   ├── api/                ✅ ProductApiClient, OrderApiClient
│   │   ├── db/                 ✅ dbHelper.js
│   │   └── utils/              ✅ constants.js, testData.js
│   ├── fixtures/               ✅ (DO NOT CHANGE)
│   │   └── index.js            ✅ Custom fixtures
│   ├── unit/                   ✅ (DO NOT CHANGE)
│   ├── integration/            ✅ (DO NOT CHANGE)
│   └── setup.js                ✅ (DO NOT CHANGE)
├── playwright.config.js        ✅ (UPDATE in Phase 2)
└── package.json                ✅ (DO NOT CHANGE)
```

---

## 📊 Proposed Structure (After Improvements)

```
VintageDagoShop/
├── tests/
│   ├── e2e/                    ✅ (unchanged)
│   │   ├── pages/
│   │   ├── steps/
│   │   ├── assertions/
│   │   ├── specs/
│   │   ├── api/
│   │   ├── db/
│   │   └── utils/
│   │
│   ├── fixtures/               ✅ (unchanged)
│   │   └── index.js
│   │
│   ├── helpers/                🆕 CREATE in Phase 3
│   │   ├── api-client.js
│   │   ├── logger.js
│   │   └── wait-helper.js
│   │
│   ├── test-data/              🆕 CREATE in Phase 4
│   │   ├── users.json
│   │   ├── products.json
│   │   └── orders.json
│   │
│   ├── auth/                   🆕 CREATE in Phase 2
│   │   └── .gitkeep
│   │
│   ├── setup/                  🆕 CREATE in Phase 2
│   │   └── global-setup.js
│   │
│   ├── unit/                   ✅ (unchanged)
│   ├── integration/            ✅ (unchanged)
│   └── setup.js                ✅ (unchanged)
│
├── playwright.config.js        ✅ (MODIFY in Phase 2)
└── package.json                ✅ (unchanged)
```

---

## 🎯 Commands to Create Folders

### PowerShell (Windows):
```powershell
# Phase 2
mkdir tests/setup
mkdir tests/auth
echo $null > tests/auth/.gitkeep

# Phase 3
mkdir tests/helpers

# Phase 4
mkdir tests/test-data
```

### Bash (Mac/Linux):
```bash
# Phase 2
mkdir -p tests/setup
mkdir -p tests/auth
touch tests/auth/.gitkeep

# Phase 3
mkdir -p tests/helpers

# Phase 4
mkdir -p tests/test-data
```

---

## 📝 Files You Need to Create

### PHASE 1: Documentation (Already Created, Reference Only)
```
docs/
├── FRAMEWORK_GETTING_STARTED.md    (CREATE)
└── CONTRIBUTING.md                 (CREATE)
```

### PHASE 2: Global Setup (YOU NEED TO CREATE)

**tests/setup/global-setup.js**
```javascript
import { chromium } from '@playwright/test';

export default async (config) => {
  const browser = await chromium.launch();

  // Login USER
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userPage.goto('http://localhost:5173/login');
  await userPage.fill('[name=email]', 'user@test.com');
  await userPage.fill('[name=password]', 'password123');
  await userPage.click('[type=submit]');
  await userPage.waitForURL('http://localhost:5173/');
  await userContext.storageState({ path: 'tests/auth/user-auth.json' });

  // (Optional) Login ADMIN
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  // ... similar login logic ...

  await browser.close();
};
```

### PHASE 3: Helpers (YOU NEED TO CREATE)

**tests/helpers/api-client.js**
```javascript
import { CONSTANTS } from '../e2e/utils/constants.js';
import { Logger } from './logger.js';

export class ApiClient {
  constructor(request) {
    this.request = request;
    this.baseUrl = CONSTANTS.API_BASE_URL;
  }

  async get(endpoint) {
    Logger.debug(`GET ${endpoint}`);
    const res = await this.request.get(`${this.baseUrl}${endpoint}`);
    if (!res.ok()) throw new Error(`GET failed: ${res.status()}`);
    return res.json();
  }

  async post(endpoint, data) {
    Logger.debug(`POST ${endpoint}`);
    const res = await this.request.post(`${this.baseUrl}${endpoint}`, { data });
    if (!res.ok()) throw new Error(`POST failed: ${res.status()}`);
    return res.json();
  }

  async put(endpoint, data) {
    Logger.debug(`PUT ${endpoint}`);
    const res = await this.request.put(`${this.baseUrl}${endpoint}`, { data });
    if (!res.ok()) throw new Error(`PUT failed: ${res.status()}`);
    return res.json();
  }

  async delete(endpoint) {
    Logger.debug(`DELETE ${endpoint}`);
    const res = await this.request.delete(`${this.baseUrl}${endpoint}`);
    if (!res.ok()) throw new Error(`DELETE failed: ${res.status()}`);
    return res.json();
  }
}
```

**tests/helpers/logger.js**
```javascript
export class Logger {
  static log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  static debug(message) { this.log(message, 'DEBUG'); }
  static info(message) { this.log(message, 'INFO'); }
  static warn(message) { this.log(message, 'WARN'); }
  static error(message) { this.log(message, 'ERROR'); }

  static section(title) {
    console.log('\n\n' + '═'.repeat(50));
    console.log(`  ${title}`);
    console.log('═'.repeat(50));
  }
}
```

**tests/helpers/wait-helper.js**
```javascript
export class WaitHelper {
  static async waitForElementStable(locator, timeoutMs = 5000) {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  static async waitForNavigation(page, action) {
    await Promise.all([
      page.waitForNavigation(),
      action(),
    ]);
  }

  static async waitForValueChange(element, initialValue, timeoutMs = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const currentValue = await element.inputValue();
      if (currentValue !== initialValue) return currentValue;
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Value did not change');
  }
}
```

### PHASE 4: Test Data (YOU NEED TO CREATE)

**tests/test-data/users.json**
```json
{
  "admin": {
    "email": "admin@vintagedago.com",
    "password": "admin123",
    "name": "Admin User"
  },
  "customer": {
    "email": "customer@vintagedago.com",
    "password": "customer123",
    "name": "Test Customer"
  },
  "invalid": {
    "email": "invalid@test.com",
    "password": "wrongpass"
  }
}
```

**tests/test-data/products.json**
```json
{
  "leatherJacket": {
    "id": "1",
    "name": "Vintage Leather Jacket",
    "price": 89.99,
    "stock": 5
  },
  "denimJeans": {
    "id": "2",
    "name": "Retro Denim Jeans",
    "price": 49.99,
    "stock": 8
  },
  "tshirt": {
    "id": "3",
    "name": "Vintage Band T-Shirt",
    "price": 29.99,
    "stock": 12
  }
}
```

---

## ✅ CHECKLIST: Files to Create

### PHASE 1: Documentation
```
[ ] docs/FRAMEWORK_GETTING_STARTED.md
[ ] docs/CONTRIBUTING.md
```

### PHASE 2: Global Setup
```
[ ] tests/setup/global-setup.js
[ ] tests/auth/.gitkeep
[ ] Modify: playwright.config.js
```

### PHASE 3: Helpers
```
[ ] tests/helpers/api-client.js
[ ] tests/helpers/logger.js
[ ] tests/helpers/wait-helper.js
[ ] Refactor: tests/e2e/api/productApiClient.js
[ ] Refactor: tests/e2e/api/orderApiClient.js
[ ] Modify: tests/fixtures/index.js
```

### PHASE 4: Test Data
```
[ ] tests/test-data/users.json
[ ] tests/test-data/products.json
[ ] tests/test-data/orders.json
[ ] Modify: tests/e2e/utils/testData.js
```

---

## 🚀 Recommended Creation Order

1. **Phase 1**: Documentation (0 code files, docs only)
2. **Phase 2**: Global Setup (1 code file + 1 folder)
3. **Phase 3**: Helpers (3 code files + refactoring)
4. **Phase 4**: Test Data (3 JSON files + refactoring)

**Total new files**: ~8 files

---

## 🎓 Important Notes

1. **Do NOT delete** existing files
2. **Do NOT rename** existing files
3. Only **create new folders** and **new files**
4. **Modify** only what's indicated (like fixtures, config)
5. After each PHASE, commit with clear message

---

## 📦 Dependencies to Install (Phase 4)

```bash
npm install --save-dev @faker-js/faker
```

This is only necessary if you want to use Faker for dynamic test data.

---

**Print this page and use it as reference while creating files.**

Good luck! 🚀
