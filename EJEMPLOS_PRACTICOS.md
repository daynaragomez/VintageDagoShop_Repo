# 📝 EJEMPLOS PRÁCTICOS - Cómo Usar la Nueva Arquitectura

## 1️⃣ EJEMPLO BÁSICO: Test de Carrito Simple

### ❌ ANTES (Sin arquitectura limpia)
```javascript
test('cart test', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  await page.click('button:has-text("Add to Cart")');
  const badge = await page.textContent('[class="badge"]');
  expect(badge).toBe('1');
});
```
**Problemas**:
- Magic timeouts (puede fallar)
- Selectores frágiles (cambian fácilmente)
- No está claro qué se prueba
- Sin retry automático

---

### ✅ DESPUÉS (Con Clean Architecture)
```javascript
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HomeSteps } from '../steps/HomeSteps';
import { HomePageAssertions } from '../assertions/HomePageAssertions';
import DatabaseHelper from '../support/db-helper';

test.describe('Shopping Cart @smoke @ui', () => {
  let homePage;
  let homeSteps;
  let homeAssertions;
  let dbHelper;

  test.beforeEach(async ({ page }) => {
    // Setup: Inicializar layers
    homePage = new HomePage(page);
    homeSteps = new HomeSteps(homePage);
    homeAssertions = new HomePageAssertions(homePage);
    dbHelper = new DatabaseHelper(config.db);
    
    // Reset database para cada test
    await dbHelper.resetDatabase();
  });

  test('should add product to cart', async () => {
    // GIVEN: Usuario en la página
    await homeSteps.openShop();
    
    // WHEN: Usuario agrega producto
    await homeSteps.addFirstProductToCart();
    
    // THEN: Carrito se actualiza
    await homeAssertions.cartBadgeShowsCount(1);
  });
});
```

**Beneficios**:
- ✅ Está claro qué hace cada acción
- ✅ Retry automático en clicks
- ✅ BD limpia antes de cada test
- ✅ Fácil de mantener

---

## 2️⃣ EJEMPLO: Crear un Nuevo Page Object

### Crear `ProductPage.js`

```javascript
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // ==================== LOCATORS ====================
  
  get productTitle() {
    return this.page.locator('[data-testid="product-title"]');
  }

  get productPrice() {
    return this.page.locator('[data-testid="product-price"]');
  }

  get productStock() {
    return this.page.locator('[data-testid="product-stock"]');
  }

  btnAddToCart() {
    return this.page.locator('[data-testid="add-to-cart-btn"]');
  }

  btnQuantity(direction) {
    return this.page.locator(
      `[data-testid="quantity-${direction}"]`
    );
  }

  // ==================== NAVIGATION ====================
  
  async gotoProduct(productId) {
    await this.navigate(`/product/${productId}`);
  }

  // ==================== UTILITIES ====================
  
  async getProductTitle() {
    return this.getText(this.productTitle);
  }

  async getProductPrice() {
    return this.getText(this.productPrice);
  }

  async getProductStock() {
    const text = await this.getText(this.productStock);
    return parseInt(text);
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.click(this.btnQuantity('up'));
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.click(this.btnQuantity('down'));
    }
  }
}
```

**Reglas Seguidas**:
- ✅ Solo getters de locators
- ✅ Solo métodos de navegación
- ✅ SIN assertions
- ✅ SIN lógica de negocio
- ✅ SIN waits complicados

---

## 3️⃣ EJEMPLO: Crear Steps (Acciones de Usuario)

### Crear `ProductSteps.js`

```javascript
export class ProductSteps {
  constructor(productPage) {
    this.productPage = productPage;
  }

  /**
   * Usuario ve detalles del producto
   */
  async viewProductDetails(productId) {
    await this.productPage.gotoProduct(productId);
  }

  /**
   * Usuario aumenta cantidad a N unidades
   */
  async increaseQuantityTo(desiredQuantity) {
    // Supongamos que empieza en 1
    for (let i = 1; i < desiredQuantity; i++) {
      await this.productPage.increaseQuantity(1);
    }
  }

  /**
   * Usuario agrega producto al carrito
   */
  async addProductToCart() {
    const button = this.productPage.btnAddToCart();
    await this.productPage.click(button);
  }

  /**
   * Usuario agrega N unidades al carrito
   */
  async addProductQuantityToCart(quantity) {
    // Aumentar cantidad primero
    if (quantity > 1) {
      await this.increaseQuantityTo(quantity);
    }
    // Luego agregar al carrito
    await this.addProductToCart();
  }
}
```

**¿Qué son Steps?**
- ✅ Acciones completas de usuario
- ✅ Combinan métodos de Page Objects
- ✅ Lenguaje de negocio: "Usuario agrega..."
- ✅ Reutilizables en múltiples tests
- ✅ SIN assertions

---

## 4️⃣ EJEMPLO: Crear Assertions (Verificaciones)

### Crear `ProductAssertions.js`

```javascript
import { expect } from '@playwright/test';

export class ProductAssertions {
  constructor(productPage) {
    this.productPage = productPage;
  }

  /**
   * Verificar que el título del producto es correcto
   */
  async titleIs(expectedTitle) {
    const title = await this.productPage.getProductTitle();
    expect(title).toBe(expectedTitle);
  }

  /**
   * Verificar que el precio se muestra
   */
  async priceDisplays(expectedPrice) {
    const price = await this.productPage.getProductPrice();
    expect(price).toContain(expectedPrice);
  }

  /**
   * Verificar que hay stock disponible
   */
  async hasStockAvailable() {
    const stock = await this.productPage.getProductStock();
    expect(stock).toBeGreaterThan(0);
  }

  /**
   * Verificar que el botón "Add to Cart" está habilitado
   */
  async addToCartButtonIsEnabled() {
    const button = this.productPage.btnAddToCart();
    await expect(button).toBeEnabled();
  }

  /**
   * Verificar que el stock se redujo después de compra
   */
  async stockReducedBy(expectedReduction) {
    const currentStock = await this.productPage.getProductStock();
    const expectedStock = 10 - expectedReduction; // Ej: stock inicial 10
    expect(currentStock).toBe(expectedStock);
  }
}
```

**¿Qué son Assertions?**
- ✅ Solo verificaciones
- ✅ Métodos con nombres descriptivos
- ✅ Mensajes de error claros
- ✅ Reutilizables en múltiples tests
- ✅ SIN navigation, SIN clicks

---

## 5️⃣ EJEMPLO COMPLETO: Test de Producto

```javascript
import { test } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { ProductSteps } from '../steps/ProductSteps';
import { ProductAssertions } from '../assertions/ProductAssertions';
import { CartSteps } from '../steps/CartSteps';
import { CartAssertions } from '../assertions/CartAssertions';

test.describe('Product Details @ui @smoke', () => {
  let productPage;
  let productSteps;
  let productAssertions;
  let cartSteps;
  let cartAssertions;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    productSteps = new ProductSteps(productPage);
    productAssertions = new ProductAssertions(productPage);
    
    // Cart objects
    cartSteps = new CartSteps(productPage);
    cartAssertions = new CartAssertions(productPage);
  });

  test('should display product details correctly', async () => {
    // GIVEN: Usuario navega a producto #1
    await productSteps.viewProductDetails(1);
    
    // THEN: Verifica que se muestre info correcta
    await productAssertions.titleIs('Vintage Leather Jacket');
    await productAssertions.priceDisplays('$29.99');
    await productAssertions.hasStockAvailable();
  });

  test('should add product quantity to cart', async () => {
    // GIVEN: Usuario en página de producto
    await productSteps.viewProductDetails(1);
    
    // WHEN: Usuario agrega 3 unidades
    await productSteps.addProductQuantityToCart(3);
    
    // THEN: Verifica carrito
    await cartAssertions.cartBadgeShowsCount(3);
    await cartAssertions.cartTotalIs(89.97); // 29.99 * 3
  });
});
```

---

## 6️⃣ EJEMPLO: Usar API Client

### Test usando API para setup

```javascript
import ApiClient from '../support/api-client';

test('should fetch products via API', async () => {
  const apiClient = new ApiClient('http://localhost:3000/api');
  
  // GET request con retry automático
  const response = await apiClient.get('/products');
  
  expect(response.status).toBe(200);
  expect(response.data).toHaveLength(3);
  expect(response.data[0].name).toBe('Vintage Leather Jacket');
});

test('should create order via API', async () => {
  const apiClient = new ApiClient('http://localhost:3000/api');
  
  const orderData = {
    customerId: 1,
    items: [{ productId: 1, quantity: 2 }],
    totalPrice: 59.98
  };
  
  // POST request con retry automático
  const response = await apiClient.post('/orders', orderData);
  
  expect(response.status).toBe(201);
  expect(response.data.id).toBeDefined();
});
```

---

## 7️⃣ EJEMPLO: Usar Database Helper

### Test usando BD para setup/verification

```javascript
import DatabaseHelper from '../support/db-helper';
import { config } from '../config/environments';

test('should verify stock after order', async () => {
  const dbHelper = new DatabaseHelper(config.db);
  
  // Setup: Verificar stock inicial
  const product = await dbHelper.getProduct(1);
  expect(product.stock).toBe(5); // Stock inicial
  
  // Act: Simular compra
  await dbHelper.executeInTransaction(async (conn) => {
    await conn.query(
      'UPDATE products SET stock = stock - 2 WHERE id = ?',
      [1]
    );
  });
  
  // Verify: Stock actualizado
  const updatedProduct = await dbHelper.getProduct(1);
  expect(updatedProduct.stock).toBe(3); // 5 - 2
});

test('should reset database', async () => {
  const dbHelper = new DatabaseHelper(config.db);
  
  // Setup: Crear data de test
  await dbHelper.createOrder({
    customerId: 1,
    totalPrice: 99.99
  });
  
  // Verify: Orden creada
  let count = await dbHelper.countOrders();
  expect(count).toBeGreaterThan(0);
  
  // Reset: Limpiar BD
  await dbHelper.resetDatabase();
  
  // Verify: BD limpia
  count = await dbHelper.countOrders();
  expect(count).toBe(0);
});
```

---

## 8️⃣ EJEMPLO: Usar Logger

### Test con logging estructurado

```javascript
import Logger from '../support/logger';

const logger = new Logger('ShoppingTest');

test('should log all user actions', async () => {
  logger.info('🛒 Starting shopping flow test');
  
  // Acción 1
  logger.logAction('User opened shop', { timestamp: new Date() });
  await homeSteps.openShop();
  
  // Acción 2
  logger.logAction('User added product', { productId: 1, quantity: 1 });
  await homeSteps.addProductToCart(1);
  
  // Verificación
  logger.logAssertion(
    'Cart badge shows count',
    { expected: 1, actual: 1 }
  );
  await homeAssertions.cartBadgeShowsCount(1);
  
  logger.info('✅ Shopping flow completed successfully');
});
```

**Output en console**:
```
[2024-12-08T14:30:45.123Z] [ShoppingTest] ℹ️ INFO 🛒 Starting shopping flow test
[2024-12-08T14:30:46.456Z] [ShoppingTest] ℹ️ INFO 👤 User opened shop
[2024-12-08T14:30:47.789Z] [ShoppingTest] ℹ️ INFO 👤 User added product {"productId":1,"quantity":1}
[2024-12-08T14:30:48.012Z] [ShoppingTest] 🐛 DEBUG ✓ Assert: Cart badge shows count
[2024-12-08T14:30:48.345Z] [ShoppingTest] ℹ️ INFO ✅ Shopping flow completed successfully
```

---

## 9️⃣ EJEMPLO: Multi-Ambiente

### Mismo test ejecutado en dev, staging y prod

```javascript
// tests/e2e/specs/auth.spec.js
import { test } from '@playwright/test';
import { getEnvironment } from '../config/environments';

// Automáticamente detecta el ambiente
const env = getEnvironment();

test.describe(`Login Tests (${env.environment})`, () => {
  test.beforeEach(async ({ page }) => {
    // Va a la URL configurada para este ambiente
    await page.goto(env.baseURL);
  });

  test('should login successfully', async ({ page }) => {
    // El test se ejecuta en:
    // - localhost:5173 si TEST_ENV=dev
    // - staging.vintagedago.com si TEST_ENV=staging
    // - vintagedago.com si TEST_ENV=production
    // - frontend-test:5173 si CI=true
    
    // Rest del test igual para todos los ambientes
    await page.fill('[data-testid="email"]', 'user@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-btn"]');
    
    await expect(page).toHaveURL(`${env.baseURL}/dashboard`);
  });
});
```

**Ejecución**:
```bash
# Local dev
npm run test:e2e

# Staging
TEST_ENV=staging npm run test:e2e

# Production (cuidado!)
TEST_ENV=production npm run test:e2e

# CI (automático)
CI=true npm run test:e2e
```

---

## 🔟 RESUMEN: Flujo de Crear un Test Nuevo

```
1. CREAR PAGE OBJECT
   └─ File: tests/e2e/pages/NuevaPage.js
   └─ Contiene: Solo locators y navigation

2. CREAR STEPS
   └─ File: tests/e2e/steps/NuevaSteps.js
   └─ Contiene: Acciones de usuario (combina page methods)

3. CREAR ASSERTIONS
   └─ File: tests/e2e/assertions/NuevaAssertions.js
   └─ Contiene: Solo verificaciones (expect statements)

4. CREAR TEST FILE
   └─ File: tests/e2e/specs/nueva.spec.js
   └─ Contiene: Arrange-Act-Assert con steps y assertions

5. EJECUTAR TEST
   └─ npm run test:e2e -- --grep "test name"
   └─ O en GitHub Actions automáticamente

6. VER REPORTE
   └─ playwright-report/index.html
   └─ O en GitHub Actions > Artifacts
```

---

## 📚 REFERENCIA RÁPIDA

| Necesito | Archivo | Qué tiene |
|----------|---------|-----------|
| Hacer click en algo | Page Object | `btnAddToCart()` |
| Agregar producto | Steps | `addProductToCart()` |
| Verificar carrito | Assertions | `cartBadgeShowsCount(1)` |
| Llamar API | support/api-client.js | `apiClient.get()` |
| Operación BD | support/db-helper.js | `dbHelper.getProduct()` |
| Loguear acción | support/logger.js | `logger.info()` |
| Configuración | config/environments.js | `getEnvironment()` |

---

## ✅ CHECKLIST: Antes de Hacer Commit

```
Test creado:
□ ¿Page Object solo tiene locators + navigate?
□ ¿Steps tiene nombres de acciones de usuario?
□ ¿Assertions solo tiene expect() calls?
□ ¿DB se resetea en beforeEach?
□ ¿Test sigue patrón Arrange-Act-Assert?
□ ¿Hay logging de acciones importantes?
□ ¿Test puede ejecutarse múltiples veces sin errores?
□ ¿Test es independiente de otros tests?
□ ¿Selectores usan data-testid (no class/id)?
□ ¿No hay magic timeouts, solo waitFor?

Documentación:
□ ¿Tiene descripción clara del test?
□ ¿Tiene tags (@smoke, @ui, @critical)?
□ ¿Código tiene comentarios donde es necesario?

Antes de push:
□ ¿El test pasa localmente?
□ ¿npm run lint pasa?
□ ¿npm run format aplicado?
□ ¿Commit message es descriptivo?
```

---

**Todos los ejemplos están listos para copiar-pegar y usar en tu proyecto.**
