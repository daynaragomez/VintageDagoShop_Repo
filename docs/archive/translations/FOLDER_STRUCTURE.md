# 📁 Estructura de Carpetas - VintageDagoShop

## 📊 Estructura ACTUAL (IMPLEMENTADA ✅)

```
VintageDagoShop/
├── tests/
│   ├── e2e/                    ✅ (NO CAMBIAR)
│   │   ├── pages/              ✅ HomePage, ProductPage, etc.
│   │   ├── steps/              ✅ HomeSteps, ProductSteps, etc.
│   │   ├── assertions/         ✅ HomeAssertions, etc.
│   │   ├── specs/              ✅ home.spec.js, product.spec.js, etc.
│   │   ├── api/                ✅ ProductApiClient, OrderApiClient
│   │   ├── db/                 ✅ dbHelper.js
│   │   └── utils/              ✅ constants.js, testData.js
│   ├── fixtures/               ✅ (NO CAMBIAR)
│   │   └── index.js            ✅ Custom fixtures
│   ├── unit/                   ✅ (NO CAMBIAR)
│   ├── integration/            ✅ (NO CAMBIAR)
│   └── setup.js                ✅ (NO CAMBIAR)
├── playwright.config.js        ✅ (ACTUALIZAR en Fase 2)
└── package.json                ✅ (NO CAMBIAR)
```

---

## 📊 Estructura PROPUESTA (Después de mejoras)

```
VintageDagoShop/
├── tests/
│   ├── e2e/                    ✅ (sin cambios)
│   │   ├── pages/
│   │   ├── steps/
│   │   ├── assertions/
│   │   ├── specs/
│   │   ├── api/
│   │   ├── db/
│   │   └── utils/
│   │
│   ├── fixtures/               ✅ (sin cambios)
│   │   └── index.js
│   │
│   ├── helpers/                🆕 CREAR en Fase 3
│   │   ├── api-client.js
│   │   ├── logger.js
│   │   └── wait-helper.js
│   │
│   ├── test-data/              🆕 CREAR en Fase 4
│   │   ├── users.json
│   │   ├── products.json
│   │   └── orders.json
│   │
│   ├── auth/                   🆕 CREAR en Fase 2
│   │   └── .gitkeep
│   │
│   ├── setup/                  🆕 CREAR en Fase 2
│   │   └── global-setup.js
│   │
│   ├── unit/                   ✅ (sin cambios)
│   ├── integration/            ✅ (sin cambios)
│   └── setup.js                ✅ (sin cambios)
│
├── playwright.config.js        ✅ (MODIFICAR en Fase 2)
└── package.json                ✅ (sin cambios)
```

---

## 🎯 Comandos para crear carpetas

### PowerShell (Windows):
```powershell
# Fase 2
mkdir tests/setup
mkdir tests/auth
echo $null > tests/auth/.gitkeep

# Fase 3
mkdir tests/helpers

# Fase 4
mkdir tests/test-data
```

### Bash (Mac/Linux):
```bash
# Fase 2
mkdir -p tests/setup
mkdir -p tests/auth
touch tests/auth/.gitkeep

# Fase 3
mkdir -p tests/helpers

# Fase 4
mkdir -p tests/test-data
```

---

## 📝 Archivos que NECESITAS crear

### FASE 1: Documentación (ya creados, solo referencia)
```
docs/
├── FRAMEWORK_GETTING_STARTED.md    (CREAR)
└── CONTRIBUTING.md                 (CREAR)
```

### FASE 2: Global Setup (NECESITAS CREAR)

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

  // (Opcional) Login ADMIN
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  // ... similar login logic ...

  await browser.close();
};
```

### FASE 3: Helpers (NECESITAS CREAR)

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

### FASE 4: Test Data (NECESITAS CREAR)

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

## ✅ CHECKLIST: Archivos para crear

### FASE 1: Documentación
```
[ ] docs/FRAMEWORK_GETTING_STARTED.md
[ ] docs/CONTRIBUTING.md
```

### FASE 2: Global Setup
```
[ ] tests/setup/global-setup.js
[ ] tests/auth/.gitkeep
[ ] Modificar: playwright.config.js
```

### FASE 3: Helpers
```
[ ] tests/helpers/api-client.js
[ ] tests/helpers/logger.js
[ ] tests/helpers/wait-helper.js
[ ] Refactorizar: tests/e2e/api/productApiClient.js
[ ] Refactorizar: tests/e2e/api/orderApiClient.js
[ ] Modificar: tests/fixtures/index.js
```

### FASE 4: Test Data
```
[ ] tests/test-data/users.json
[ ] tests/test-data/products.json
[ ] tests/test-data/orders.json
[ ] Modificar: tests/e2e/utils/testData.js
```

---

## 🚀 Orden de creación RECOMENDADO

1. **Fase 1**: Documentación (0 archivos de código, solo docs)
2. **Fase 2**: Global Setup (1 archivo código + 1 carpeta)
3. **Fase 3**: Helpers (3 archivos código + refactoring)
4. **Fase 4**: Test Data (3 archivos JSON + refactoring)

**Total de archivos nuevos**: ~8 archivos

---

## 🎓 NOTAS IMPORTANTES

1. **No elimines** archivos existentes
2. **No renombres** archivos existentes
3. Solo **crea nuevas carpetas** y **archivos nuevos**
4. **Modifica** solo lo indicado (como fixtures, config)
5. Después de cada FASE, haz commit con mensaje claro

---

## 📦 Dependencias para instalar (Fase 4)

```bash
npm install --save-dev @faker-js/faker
```

Esto solo es necesario si quieres usar Faker para datos dinámicos.

---

**Imprime esta página y úsala como referencia mientras creas los archivos.**

¡Éxito! 🚀
