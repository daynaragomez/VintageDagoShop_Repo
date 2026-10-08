# 📋 CONVENCIONES DE NOMBRES - Arquitectura de Testing

## 🎯 PRINCIPIOS FUNDAMENTALES

```
1. camelCase OBLIGATORIO (no snake_case, no PascalCase en variables)
2. DESCRIPTIVO - El nombre debe explicar QUÉ ES
3. ESPECÍFICO - Evitar nombres genéricos como "data", "item", "test"
4. NO SOLAPADOS - Nombres únicos, sin ambigüedad
5. AUTODOCU - El nombre es documentación viva
```

---

## 📂 NIVEL 1: ARCHIVOS Y CLASES

### ❌ MALO (Genérico, ambiguo)
```
home.js                  ← ¿Qué es home? ¿Página? ¿Steps?
page.js                  ← Muy genérico
assertions.js            ← ¿Assertions de qué?
test.js                  ← Muy ambiguo
utils.js                 ← ¿Qué utilitarios?
helper.js                ← ¿Ayuda con qué?
```

### ✅ BUENO (Descriptivo, específico)
```
HomePage.js              ← Es la página de inicio
HomePageSteps.js         ← Steps para la página de inicio (no confundir con page)
HomePageAssertions.js    ← Assertions para la página de inicio
AuthenticationFlow.js    ← Es un flow completo de autenticación
ApiProductClient.js      ← Cliente API específico para productos
DbOrderHelper.js         ← Helper específico para órdenes en BD
```

---

## 🏗️ NIVEL 2: PAGE OBJECTS (tests/e2e/pages/)

### Convención: `{FeatureName}Page.js`

```javascript
// ❌ MALO
class Home { ... }           ← Muy corto, ambiguo
class ShoppingPage { ... }   ← Genérico, podría ser cualquier página
class Form { ... }           ← ¿Cuál forma?

// ✅ BUENO
class HomePage { ... }                        ← Específico: página de inicio
class ProductDetailPage { ... }               ← Específico: detalle de producto
class ShoppingCartPage { ... }                ← Específico: carrito de compras
class CheckoutConfirmationPage { ... }       ← Específico: confirmación de checkout
class UserProfileSettingsPage { ... }        ← Específico: perfil de usuario
class AdminDashboardPage { ... }              ← Específico: dashboard admin
```

### Propiedades de Locators: `btn{Action}` `{Element}{State}`

```javascript
class HomePage {
  // ❌ MALO (genérico)
  get button() { ... }
  get link() { ... }
  get input() { ... }
  get cart() { ... }

  // ✅ BUENO (descriptivo)
  btnAddToCart() { ... }
  btnViewDetails() { ... }
  btnApplyCoupon() { ... }
  btnCheckout() { ... }
  
  get cartBadgeCounter() { ... }
  get productSearchInput() { ... }
  get categoryFilterDropdown() { ... }
  get productListContainer() { ... }
  get emptyCartMessage() { ... }
}
```

### Métodos de Utilidad: `get{Property}` `navigate{Path}`

```javascript
class ProductDetailPage {
  // ❌ MALO
  async getName() { ... }
  async getPrice() { ... }
  async go() { ... }

  // ✅ BUENO
  async getProductTitle() { ... }
  async getProductPrice() { ... }
  async getProductStockQuantity() { ... }
  async getAverageProductRating() { ... }
  async navigateToProductReviews() { ... }
  async navigateBackToProductList() { ... }
}
```

---

## 👥 NIVEL 3: STEPS (tests/e2e/steps/)

### Convención: `{FeatureName}Steps.js`

```javascript
// ❌ MALO (genérico, ambiguo)
class ShoppingSteps { ... }      ← ¿Qué tipo de shopping?
class UserSteps { ... }          ← ¿Qué acciones de usuario?
class Steps { ... }              ← Muy genérico

// ✅ BUENO (descriptivo)
class HomePageSteps { ... }                    ← Steps de página de inicio
class ProductBrowsingSteps { ... }             ← Steps para navegar productos
class ShoppingCartSteps { ... }                ← Steps específico de carrito
class CheckoutProcessSteps { ... }             ← Steps específico de checkout
class UserAuthenticationSteps { ... }          ← Steps específico de autenticación
class AdminProductManagementSteps { ... }      ← Steps de admin
```

### Métodos: `async user{Action}`

```javascript
class ShoppingCartSteps {
  // ❌ MALO (muy genérico)
  async add() { ... }
  async remove() { ... }
  async update() { ... }
  async go() { ... }

  // ✅ BUENO (describe la acción del usuario)
  async userAddsProductToCart(productId, quantity) { ... }
  async userRemovesProductFromCart(productId) { ... }
  async userUpdatesProductQuantity(productId, newQuantity) { ... }
  async userNavigatesToCheckout() { ... }
  async userAppliesCouponCode(couponCode) { ... }
  async userClearsShoppingCart() { ... }
  async userContinuesShopping() { ... }
}
```

---

## ✔️ NIVEL 4: ASSERTIONS (tests/e2e/assertions/)

### Convención: `{FeatureName}Assertions.js`

```javascript
// ❌ MALO
class HomeAssertions { ... }     ← Ambiguo
class Assertions { ... }         ← Muy genérico
class Verifications { ... }      ← Genérico

// ✅ BUENO
class HomePageAssertions { ... }              ← Assertions de página de inicio
class ShoppingCartAssertions { ... }          ← Assertions de carrito
class ProductDetailAssertions { ... }         ← Assertions de detalle de producto
class CheckoutPageAssertions { ... }          ← Assertions de checkout
class UserAuthenticationAssertions { ... }    ← Assertions de auth
```

### Métodos: `async assert{Condition}`

```javascript
class ShoppingCartAssertions {
  // ❌ MALO
  async cartIsVisible() { ... }
  async itemCount(n) { ... }
  async priceIs(price) { ... }
  async isEmpty() { ... }

  // ✅ BUENO
  async cartBadgeShowsItemCount(expectedCount) { ... }
  async cartTotalPriceEquals(expectedTotal) { ... }
  async cartItemDisplaysProductName(productName) { ... }
  async cartItemDisplaysQuantity(productId, quantity) { ... }
  async cartIsEmptyAndShowsEmptyMessage() { ... }
  async checkoutButtonIsDisabledWhenCartEmpty() { ... }
  async applyDiscountCodeReducesTotalPrice(originalPrice, discountedPrice) { ... }
}
```

---

## 🔧 NIVEL 5: SUPPORT UTILITIES (tests/e2e/support/)

### Convención: `{Purpose}{Type}.js` (client, helper, service)

```javascript
// ❌ MALO
api.js                  ← ¿Cuál API?
db.js                   ← ¿Cuál base de datos?
utils.js                ← ¿Qué utilidades?
logger.js               ← OK, pero podría ser más específico

// ✅ BUENO
ApiProductClient.js         ← Cliente específico para API de productos
ApiOrderClient.js           ← Cliente específico para API de órdenes
DbOrderRepository.js        ← Repository para órdenes en BD
DbProductRepository.js      ← Repository para productos en BD
TestDataFactory.js          ← Factory para crear datos de test
AuthenticationService.js    ← Servicio de autenticación
TestReportLogger.js         ← Logger específico para reportes
```

### Métodos de API Client: `async {httpMethod}{Resource}`

```javascript
class ApiProductClient {
  // ❌ MALO
  async get(id) { ... }
  async post(data) { ... }
  async search(term) { ... }

  // ✅ BUENO
  async getProductById(productId) { ... }
  async getAllProducts() { ... }
  async getProductsByCategory(categoryId) { ... }
  async getProductsOnSale() { ... }
  async postCreateProduct(productData) { ... }
  async putUpdateProductPrice(productId, newPrice) { ... }
  async deleteProductById(productId) { ... }
  async searchProductsByName(searchTerm) { ... }
}
```

### Métodos de DB Helper: `async {operation}{Resource}`

```javascript
class DbOrderRepository {
  // ❌ MALO
  async get(id) { ... }
  async create(data) { ... }
  async delete(id) { ... }
  async reset() { ... }

  // ✅ BUENO
  async getOrderById(orderId) { ... }
  async getAllOrders() { ... }
  async getOrdersByUserId(userId) { ... }
  async getOrdersByStatus(status) { ... }
  async createNewOrder(orderData) { ... }
  async updateOrderStatus(orderId, newStatus) { ... }
  async deleteOrderById(orderId) { ... }
  async resetAllOrdersInTestDatabase() { ... }
}
```

---

## 🧪 NIVEL 6: TESTS (tests/e2e/specs/)

### Convención: `{feature}.spec.js`

```javascript
// ❌ MALO
test.js                  ← Muy genérico
shopping-test.js         ← snake_case (incorrecto)
testShopping.js          ← No indica qué es

// ✅ BUENO
home.spec.js             ← Tests de página de inicio
productDetail.spec.js    ← Tests de detalle de producto
shoppingCart.spec.js     ← Tests de carrito
checkout.spec.js         ← Tests de checkout
userAuthentication.spec.js  ← Tests de autenticación
adminProductManagement.spec.js  ← Tests de admin
```

### Nombres de Tests: `should {action} {expectedResult}`

```javascript
// ❌ MALO
test('test1', () => { ... })
test('cart', () => { ... })
test('add', () => { ... })
test('user can shop', () => { ... })

// ✅ BUENO
test('should display home page with all products', () => { ... })
test('should add product to cart and update badge count', () => { ... })
test('should apply coupon code and reduce total price', () => { ... })
test('should prevent checkout when cart is empty', () => { ... })
test('should display error message when product out of stock', () => { ... })
test('should calculate correct total with tax and shipping', () => { ... })
```

### Tags de Tests: `@{category}`

```javascript
// ❌ MALO
@test              ← Demasiado genérico
@1                 ← Número sin sentido
@quick             ← Ambiguo

// ✅ BUENO
@smoke             ← Tests críticos rápidos
@ui                ← Tests de interfaz
@integration       ← Tests de integración
@api               ← Tests de API
@authentication    ← Tests de autenticación
@checkout          ← Tests de checkout
@critical          ← Flujos críticos
@performance       ← Tests de performance
@regression        ← Tests de regresión
@security          ← Tests de seguridad
@slow              ← Tests lentos
@unstable          ← Tests que fluctúan
```

---

## 📝 PATRONES GLOBALES

### Nombres de Variables en Tests

```javascript
// ❌ MALO
const data = { ... }
const response = { ... }
const result = { ... }
const page = { ... }
const obj = { ... }

// ✅ BUENO
const productData = { ... }
const apiResponse = { ... }
const testResult = { ... }
const homePageObject = { ... }
const shoppingCartData = { ... }
const userAuthenticationCredentials = { ... }
```

### Nombres de Constantes

```javascript
// ❌ MALO
const URL = 'http://...'
const TIMEOUT = 5000
const COUNT = 3
const STATUS = 'ok'

// ✅ BUENO
const HOME_PAGE_URL = 'http://localhost:5173/'
const API_REQUEST_TIMEOUT_MS = 30000
const PRODUCT_ADDITION_MAX_RETRIES = 3
const ORDER_STATUS_COMPLETED = 'completed'
const DEFAULT_SHOPPING_CART_QUANTITY = 1
```

### Nombres de Funciones Helper

```javascript
// ❌ MALO
function process(data) { ... }
function handle(error) { ... }
function check(value) { ... }
function do() { ... }

// ✅ BUENO
function calculateOrderTotalWithTaxAndShipping(orderData) { ... }
function logApiRequestErrorWithRetryCount(error, attemptNumber) { ... }
function verifyProductStockIsAvailable(productId) { ... }
function waitForApiResponseWithExponentialBackoff(maxRetries) { ... }
```

---

## 🎯 EJEMPLO COMPLETO: Flujo de Compra

### ✅ ESTRUCTURA CON NOMBRES CORRECTOS

```
tests/e2e/
│
├─ pages/
│  ├─ HomePage.js
│  │  ├─ btnAddToCart(productId)
│  │  ├─ productSearchInput
│  │  ├─ cartBadgeCounter
│  │  ├─ getProductTitle(productId)
│  │  └─ navigateToProductDetail(productId)
│  │
│  ├─ ProductDetailPage.js
│  │  ├─ btnAddToCartOnDetail()
│  │  ├─ quantityInputField
│  │  ├─ getProductTitle()
│  │  ├─ getProductPrice()
│  │  └─ navigateBackToShoppingList()
│  │
│  └─ ShoppingCartPage.js
│     ├─ btnProceedToCheckout()
│     ├─ cartItemsContainer
│     ├─ getCartTotalPrice()
│     ├─ userRemovesProductFromCart(productId)
│     └─ navigateContinueShopping()
│
├─ steps/
│  ├─ HomePageSteps.js
│  │  ├─ userOpensHomePage()
│  │  ├─ userSearchesForProductByName(productName)
│  │  └─ userAddsProductToCartFromListing(productId)
│  │
│  ├─ ProductDetailSteps.js
│  │  ├─ userNavigatesToProductDetail(productId)
│  │  ├─ userIncreasesProductQuantityTo(quantity)
│  │  └─ userAddsProductToCartFromDetail()
│  │
│  └─ ShoppingCartSteps.js
│     ├─ userNavigatesToShoppingCart()
│     ├─ userAppliesCouponCodeToCart(couponCode)
│     └─ userProceedsToCheckout()
│
├─ assertions/
│  ├─ HomePageAssertions.js
│  │  ├─ productListDisplaysCorrectItems(expectedCount)
│  │  ├─ cartBadgeShowsCorrectItemCount(expectedCount)
│  │  └─ searchResultsContainProduct(productName)
│  │
│  ├─ ProductDetailAssertions.js
│  │  ├─ productTitleDisplaysCorrectly(expectedTitle)
│  │  ├─ productPriceDisplaysCorrectFormat(expectedPrice)
│  │  └─ addToCartButtonIsEnabled()
│  │
│  └─ ShoppingCartAssertions.js
│     ├─ cartContainsProduct(productId, quantity)
│     ├─ cartTotalPriceCalculatedCorrectly(expectedTotal)
│     └─ checkoutButtonIsEnabledWhenCartNotEmpty()
│
├─ support/
│  ├─ ApiProductClient.js
│  │  ├─ getProductById(productId)
│  │  ├─ getAllProducts()
│  │  └─ getProductsByCategory(categoryId)
│  │
│  ├─ DbOrderRepository.js
│  │  ├─ createTestOrder(orderData)
│  │  ├─ getOrderById(orderId)
│  │  └─ deleteAllTestOrders()
│  │
│  └─ TestDataFactory.js
│     ├─ createValidProductData()
│     ├─ createValidOrderData()
│     └─ createValidUserCredentials()
│
└─ specs/
   └─ shoppingCart.spec.js
      ├─ @smoke @ui should display shopping cart with products
      ├─ @smoke @critical should apply coupon and update total
      └─ @regression should prevent checkout with empty cart
```

### ✅ TEST COMPLETO CON NOMBRES DESCRIPTIVOS

```javascript
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { HomePageSteps } from '../steps/HomePageSteps';
import { ProductDetailSteps } from '../steps/ProductDetailSteps';
import { ShoppingCartSteps } from '../steps/ShoppingCartSteps';
import { HomePageAssertions } from '../assertions/HomePageAssertions';
import { ProductDetailAssertions } from '../assertions/ProductDetailAssertions';
import { ShoppingCartAssertions } from '../assertions/ShoppingCartAssertions';
import { DbOrderRepository } from '../support/DbOrderRepository';

test.describe('Shopping Cart Complete Flow @smoke @critical', () => {
  let homePageObject;
  let productDetailPageObject;
  let shoppingCartPageObject;
  
  let homePageStepsExecutor;
  let productDetailStepsExecutor;
  let shoppingCartStepsExecutor;
  
  let homePageAssertionsValidator;
  let productDetailAssertionsValidator;
  let shoppingCartAssertionsValidator;
  
  let orderDatabaseRepository;

  test.beforeEach(async ({ page }) => {
    // Initialize Page Objects
    homePageObject = new HomePage(page);
    productDetailPageObject = new ProductDetailPage(page);
    shoppingCartPageObject = new ShoppingCartPage(page);
    
    // Initialize Steps (executors of user actions)
    homePageStepsExecutor = new HomePageSteps(homePageObject);
    productDetailStepsExecutor = new ProductDetailSteps(productDetailPageObject);
    shoppingCartStepsExecutor = new ShoppingCartSteps(shoppingCartPageObject);
    
    // Initialize Assertions (validators)
    homePageAssertionsValidator = new HomePageAssertions(homePageObject);
    productDetailAssertionsValidator = new ProductDetailAssertions(productDetailPageObject);
    shoppingCartAssertionsValidator = new ShoppingCartAssertions(shoppingCartPageObject);
    
    // Initialize Repository
    orderDatabaseRepository = new DbOrderRepository();
    await orderDatabaseRepository.resetAllTestOrdersInDatabase();
  });

  test('should complete shopping cart flow with multiple products', async () => {
    // ARRANGE: User is on home page
    await homePageStepsExecutor.userOpensHomePage();
    
    // ASSERT: Verify products load correctly
    await homePageAssertionsValidator.productListDisplaysCorrectItems(3);
    
    // ACT: User adds first product
    const firstProductIdToAdd = 1;
    await homePageStepsExecutor.userAddsProductToCartFromListing(firstProductIdToAdd);
    
    // ASSERT: Cart badge updates
    await homePageAssertionsValidator.cartBadgeShowsCorrectItemCount(1);
    
    // ACT: User navigates to product detail
    const secondProductIdToAdd = 2;
    await productDetailStepsExecutor.userNavigatesToProductDetail(secondProductIdToAdd);
    
    // ASSERT: Product details display correctly
    await productDetailAssertionsValidator.productTitleDisplaysCorrectly('Vintage Leather Jacket');
    await productDetailAssertionsValidator.productPriceDisplaysCorrectFormat('$29.99');
    
    // ACT: User increases quantity and adds to cart
    const desiredQuantity = 2;
    await productDetailStepsExecutor.userIncreasesProductQuantityTo(desiredQuantity);
    await productDetailStepsExecutor.userAddsProductToCartFromDetail();
    
    // ASSERT: Cart badge updates again
    await homePageAssertionsValidator.cartBadgeShowsCorrectItemCount(3); // 1 + 2
    
    // ACT: User navigates to shopping cart
    await shoppingCartStepsExecutor.userNavigatesToShoppingCart();
    
    // ASSERT: Cart displays all items correctly
    await shoppingCartAssertionsValidator.cartContainsProduct(firstProductIdToAdd, 1);
    await shoppingCartAssertionsValidator.cartContainsProduct(secondProductIdToAdd, desiredQuantity);
    
    // ACT: User applies coupon
    const testCouponCode = 'DISCOUNT10';
    await shoppingCartStepsExecutor.userAppliesCouponCodeToCart(testCouponCode);
    
    // ASSERT: Total price recalculated
    const expectedTotalWithDiscount = 79.97; // Calculated with 10% discount
    await shoppingCartAssertionsValidator.cartTotalPriceCalculatedCorrectly(expectedTotalWithDiscount);
    
    // ACT: User proceeds to checkout
    await shoppingCartStepsExecutor.userProceedsToCheckout();
    
    // ASSERT: Order created in database with correct data
    const lastCreatedOrderId = await orderDatabaseRepository.getLastOrderIdInTestDatabase();
    const createdOrder = await orderDatabaseRepository.getOrderById(lastCreatedOrderId);
    expect(createdOrder.totalPrice).toBe(expectedTotalWithDiscount);
    expect(createdOrder.itemCount).toBe(3);
  });
});
```

---

## 🚀 CHECKLIST DE NOMBRES

Antes de crear una clase/función, pregúntate:

- [ ] ¿El nombre está en **camelCase**?
- [ ] ¿El nombre es **descriptivo** (sin abreviaturas)?
- [ ] ¿El nombre es **específico** (no genérico)?
- [ ] ¿Hay **dos clases/funciones** con nombre similar?
- [ ] ¿Si lees el nombre en voz alta, ¿se entiende qué hace?
- [ ] ¿Alguien nuevo entiende el propósito del código sin comentarios?
- [ ] ¿El nombre diferencia claramente QUEN (Page vs Steps vs Assertions)?

---

## 📌 RESUMEN RÁPIDO

| Componente | Patrón | Ejemplo |
|-----------|--------|---------|
| **Archivos Page** | `{Feature}Page.js` | `ProductDetailPage.js` |
| **Métodos Page** | `btn{Action}`, `get{Property}` | `btnAddToCart()`, `cartBadgeCounter` |
| **Archivos Steps** | `{Feature}Steps.js` | `ShoppingCartSteps.js` |
| **Métodos Steps** | `userDoes{Action}` | `userAppliesCouponCode()` |
| **Archivos Assertions** | `{Feature}Assertions.js` | `ShoppingCartAssertions.js` |
| **Métodos Assertions** | `assert{Condition}` | `cartTotalPriceCalculatedCorrectly()` |
| **Archivos Support** | `{Purpose}{Type}.js` | `ApiProductClient.js`, `DbOrderRepository.js` |
| **Métodos Support** | `{httpMethod}{Resource}`, `{operation}{Resource}` | `getProductById()`, `createNewOrder()` |
| **Archivos Tests** | `{feature}.spec.js` | `shoppingCart.spec.js` |
| **Nombres Tests** | `should {action} {result}` | `should apply coupon and reduce total` |

---

**APLICAR ESTAS CONVENCIONES GARANTIZA:** 
✅ Código autodocu
✅ Sin ambigüedad
✅ Fácil de mantener
✅ Fácil de escalar
✅ Profesional
