# Refactored Test Structure: NUnit + Playwright en C#

## 📋 Comparación: JavaScript vs C# con NUnit

### Estructura Anterior (JavaScript + Playwright)
```javascript
test('should C001 add product...', async () => {
  await productBrowsingSteps.userNavigatesToProductListing();
  await addToCartSteps.userAddsProductToCart(PRODUCT_IDS[0]);
  await addToCartAssertions.cartBadgeShowsCount(1);
});
```

**Problemas:**
- ❌ Sin logging de pasos
- ❌ Difícil debuguear
- ❌ Sin preconditions explícitas
- ❌ Assertions mezcladas en tests

---

### Estructura Nueva (C# + NUnit + Playwright)
```csharp
[Test]
[Category("Smoke")]
public async Task TC101_AddProductToCart_DefaultQuantity_UpdatesBadge()
{
    // PRECONDITION
    Logger.Info("├─ PRECONDITION: Verify environment");
    
    // STEP 1
    Logger.Info("├─ STEP 1: User navigates to product listing");
    await _productBrowsingSteps.UserNavigatesToProductListingAsync();
    
    // STEP 2
    Logger.Info("├─ STEP 2: User adds product to cart");
    await _addToCartSteps.UserAddsProductToCartAsync(1);
    
    // STEP 3
    Logger.Info("├─ STEP 3: Verify cart badge");
    await _addToCartAssertions.CartBadgeShowsCountAsync(1);
    
    // EXPECTED RESULT
    Logger.Info("└─ EXPECTED RESULT: All verifications passed ✓");
}
```

**Beneficios:**
- ✅ Logging explícito en cada paso
- ✅ Fácil de debuguear
- ✅ Preconditions claras
- ✅ Assertions separadas
- ✅ Mensajes jerárquicos (├─, │, └─)

---

## 🏗️ Arquitectura: 5 Capas

```
┌─────────────────────────────────────────┐
│  TEST CASE (TC101_AddProductToCart.cs)  │  ← Cómo se ejecuta el test
├─────────────────────────────────────────┤
│       STEPS (AddToCartSteps.cs)         │  ← Qué hace el usuario
├─────────────────────────────────────────┤
│  PAGES (AddToCartPage.cs)               │  ← Dónde están los elementos
├─────────────────────────────────────────┤
│  ASSERTIONS (AddToCartAssertions.cs)    │  ← Qué se verifica
├─────────────────────────────────────────┤
│  SUPPORT (Logger.cs, BaseTestCase.cs)   │  ← Helpers y utilidades
└─────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
tests_csharp_example/
├── TC101_AddProductToCart.cs                    ← Test principal
├── Pages/
│   ├── ProductBrowsingPage.cs                   ← Locators + métodos
│   └── AddToCartPage.cs                         ← Cart UI methods
├── Steps/
│   ├── ProductBrowsingSteps.cs                  ← User workflows
│   └── AddToCartSteps.cs                        ← Cart workflows
├── Assertions/
│   └── AddToCartAssertions.cs                   ← Verifications
└── Support/
    ├── Logger.cs                                ← Logging utility
    └── BaseTestCase.cs                          ← Base class con helpers
```

---

## 🔍 Ejemplo Detallado: TC101

### Test Case Class
```csharp
[TestFixture]
[Category("E2E")]
[Category("AddToCart")]
public sealed class TC101_AddProductToCart : BaseTestCase
{
    // Setup/Teardown
    // Test methods con logging jerárquico
    // Preconditions explícitas
}
```

**Características:**
- ✅ `[TestFixture]` - Contenedor de tests
- ✅ `[Category]` - Tags para filtrado
- ✅ `[Test]` - Marcador de test
- ✅ Hereda de `BaseTestCase` - Acceso a Logger y helpers

---

### Page Object Pattern
```csharp
public class AddToCartPage
{
    // LOCATORS (privados)
    private ILocator CartBadge => _page.GetByTestId("cart-badge");
    
    // METHODS (públicos)
    public async Task<int> GetCartItemCountAsync() { ... }
    public async Task ClickAddToCartButtonAsync(int productId) { ... }
    public async Task<string> GetCartDataFromLocalStorageAsync() { ... }
}
```

**Características:**
- ✅ Encapsulación de locators
- ✅ Métodos claros y reutilizables
- ✅ Sin assertions en la página
- ✅ Async/await para Playwright

---

### Steps (User Workflows)
```csharp
public class AddToCartSteps
{
    public async Task UserAddsProductToCartAsync(int productId)
    {
        Logger.Info($"  Action: Click 'Add to Cart' button");
        await _addToCartPage.ClickAsync(addButton);
        
        Logger.Info($"  Verify: Product added successfully");
    }
}
```

**Características:**
- ✅ Métodos `async User{Action}Async()`
- ✅ Logging de acciones
- ✅ Reutilizable en múltiples tests
- ✅ Legible como escenario de negocio

---

### Assertions (Verifications)
```csharp
public class AddToCartAssertions
{
    public async Task CartBadgeShowsCountAsync(int expectedCount)
    {
        Logger.Info($"  Assert: Cart badge shows {expectedCount}");
        
        int actualCount = await _addToCartPage.GetCartItemCountAsync();
        
        Assert.That(actualCount, Is.EqualTo(expectedCount),
            $"Cart badge should show {expectedCount}");
        
        Logger.Info("    ✓ Cart badge count is correct");
    }
}
```

**Características:**
- ✅ Métodos `async {Condition}Async(expected)`
- ✅ Logging de expected vs actual
- ✅ Mensaje de error descriptivo
- ✅ Separado del Step

---

### Logging Output
```
[2026-10-09 14:23:45.123] [INFO] ===== Test Suite: Add to Cart E2E Tests =====
[2026-10-09 14:23:45.234] [INFO] Base URL: http://127.0.0.1:5174
[2026-10-09 14:23:45.345] [INFO] Browser: Chromium (Headed)
[2026-10-09 14:23:45.456] [INFO] [TEST SETUP] Initializing test: TC101_AddProductToCart_DefaultQuantity_UpdatesBadge
[2026-10-09 14:23:45.567] [INFO] [SETUP] Page Objects initialized
[2026-10-09 14:23:45.678] [INFO] 
[2026-10-09 14:23:45.789] [INFO] ├─ PRECONDITION: Verify environment and data
[2026-10-09 14:23:45.890] [INFO] │  ├─ Base URL: http://127.0.0.1:5174
[2026-10-09 14:23:45.901] [INFO] │  ├─ Product ID: 1
[2026-10-09 14:23:46.012] [INFO] │  └─ Expected Quantity: 1 (default)
[2026-10-09 14:23:46.123] [INFO] │
[2026-10-09 14:23:46.234] [INFO] ├─ STEP 1: User navigates to product listing page
[2026-10-09 14:23:46.345] [INFO] │  ├─ Action: Navigate to home page
[2026-10-09 14:23:46.456] [INFO] │  ├─ Verify: Products grid is loaded
[2026-10-09 14:23:46.567] [INFO] │  └─ ✓ Product listing page is ready
[2026-10-09 14:23:46.678] [INFO] │
[2026-10-09 14:23:46.789] [INFO] ├─ STEP 2: User adds product to cart
[2026-10-09 14:23:46.890] [INFO] │  ├─ Action: Click 'Add to Cart' button for product ID=1
[2026-10-09 14:23:47.001] [INFO] │  ├─ Verify: Product added successfully
[2026-10-09 14:23:47.112] [INFO] │  └─ ✓ Product added to cart (quantity=1)
[2026-10-09 14:23:47.223] [INFO] │
[2026-10-09 14:23:47.334] [INFO] ├─ STEP 3: Verify cart badge displays correct count
[2026-10-09 14:23:47.445] [INFO] │  ├─ Action: Get cart badge counter value
[2026-10-09 14:23:47.556] [INFO]   Assert: Cart badge shows 1 item(s)
[2026-10-09 14:23:47.667] [INFO]     Expected: 1
[2026-10-09 14:23:47.778] [INFO]     Actual:   1
[2026-10-09 14:23:47.889] [INFO]     ✓ Cart badge count is correct
[2026-10-09 14:23:47.990] [INFO] │
[2026-10-09 14:23:48.101] [INFO] └─ EXPECTED RESULT: All verifications passed ✓
[2026-10-09 14:23:48.212] [INFO] 
[2026-10-09 14:23:48.323] [INFO] [TEARDOWN] Test PASSED: TC101_AddProductToCart_DefaultQuantity_UpdatesBadge
```

---

## 🎯 Ventajas vs Desventajas

| Aspecto | JavaScript (Actual) | C# + NUnit (Propuesto) |
|--------|---|---|
| **Logging** | Mínimo/inexistente | ✅ Jerárquico y detallado |
| **Debugging** | Difícil | ✅ Muy fácil (paso a paso) |
| **Type Safety** | Dinámico (débil) | ✅ Estático (fuerte) |
| **IDE Support** | Básico | ✅ Excelente (IntelliSense) |
| **Setup/Teardown** | beforeEach/afterEach | ✅ [SetUp]/[TearDown] atributos |
| **Categorización** | Por archivo | ✅ [Category] atributos |
| **Traceability** | Débil | ✅ IDs de test explícitos |
| **Performance** | Rápido | Similar |
| **Learning Curve** | Bajo | Medio (pero vale la pena) |
| **Integración CI/CD** | Fácil | ✅ Muy fácil (NUnit nativo) |

---

## 🚀 Pasos para Implementar

### 1. Crear Proyecto C#
```bash
dotnet new nunit -n VintageDagoShop.Automation
cd VintageDagoShop.Automation
dotnet add package Microsoft.Playwright
dotnet add package NUnit
```

### 2. Instalar Playwright
```bash
dotnet add package Microsoft.Playwright
pwsh bin/Debug/net6.0/playwright.ps1 install
```

### 3. Estructura de Carpetas
```
VintageDagoShop.Automation/
├── Pages/
├── Steps/
├── Assertions/
├── Support/
├── Tests/
│   ├── E2E/
│   │   └── Cases/
│   │       └── TC101_AddProductToCart.cs
├── playwright.json (config)
└── VintageDagoShop.Automation.csproj
```

### 4. Ejecutar Tests
```bash
# Todos los tests
dotnet test

# Categoría específica
dotnet test --filter "Category=Smoke"

# Test específico
dotnet test --filter "Name=TC101*"

# Con salida verbose
dotnet test -v n
```

---

## 📊 Resumen

**Mejoras principales:**
1. ✅ Logging jerárquico y detallado
2. ✅ Separación clara: Test → Steps → Pages → Assertions
3. ✅ Type safety con C#
4. ✅ Fácil debugging con mensajes contextuales
5. ✅ Mejor integración con CI/CD
6. ✅ IDE support superior (IntelliSense)
7. ✅ Preconditions explícitas
8. ✅ Categorización de tests

**Mantiene lo bueno:**
- ✅ Arquitectura BDD (Pages/Steps/Assertions)
- ✅ Reutilización de Steps y Assertions
- ✅ Legibilidad de tests
- ✅ Compatibilidad con Playwright
