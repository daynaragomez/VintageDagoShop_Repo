# Comparación: Xunit vs NUnit + Playwright

## 📊 Vista General

| Aspecto | Xunit (Tu Referencia) | NUnit (Recomendado) | Diferencia |
|--------|---|---|---|
| **Namespace** | `Xunit` | `NUnit.Framework` | Sintaxis diferente |
| **Atributo Test** | `[Fact]` / `[Theory]` | `[Test]` | Similar |
| **Setup/Teardown** | Constructor/Dispose | `[SetUp]` / `[TearDown]` | NUnit más claro |
| **Categorización** | `[Trait]` | `[Category]` | Similar |
| **Inyección** | Constructor parameters | Constructor parameters | Similar |
| **Logging** | Manual con `LogInfo()` | Manual con `Logger.Info()` | Idéntico |
| **Assertions** | `Assert.*` | `Assert.That()` | Sintaxis diferente |
| **Preconditions** | Método separado | Dentro del test | Más claro en NUnit |

---

## 🔄 Equivalencia de Conceptos

### Tu Estructura (Xunit)
```csharp
// ✓ DATO: Clase heredada de BaseTestCase
// ✓ CONSTRUIDA: Inyección en constructor
// ✓ PASOS: Métodos separados Step1_(), Step2_()
// ✓ ASSERTIONS: Assert.Equal() en cada paso
// ✓ LOGGING: LogInfo() en cada paso
```

### Mi Estructura (NUnit)
```csharp
// ✓ DATO: Clase heredada de BaseTestCase
// ✓ CONSTRUIDA: Inyección en constructor + [SetUp]
// ✓ PASOS: Steps reutilizables en clase separada
// ✓ ASSERTIONS: Assert.That() en clase Assertions separada
// ✓ LOGGING: Logger.Info() con formato jerárquico
```

---

## 🎯 Ejemplo Lado a Lado

### Tu Estructura (Xunit)
```csharp
public sealed class TC104_Save10_Discount_Applies_Before_Tax_For_CA_QC 
    : BaseTestCase
{
    private readonly IWebDriver _driver;
    private readonly ProductsPage _productsPage;
    private readonly CartPage _cartPage;

    public TC104_Save10_Discount_Applies_Before_Tax_For_CA_QC(
        IWebDriver driver,
        WebDriverWait wait,
        string baseUrl,
        ILogger<TC104_Save10_Discount_Applies_Before_Tax_For_CA_QC> logger,
        Guid runId,
        Guid caseExecutionId)
        : base(logger, runId, caseExecutionId, "TC104")
    {
        _driver = driver;
        _productsPage = new ProductsPage(driver, wait);
        _cartPage = new CartPage(driver, wait);
    }

    public async Task PreconditionsAsync(CancellationToken cancellationToken = default)
    {
        LogInfo("Preconditions: resetting baseline data...");
        await _api.ResetBaselineAsync(cancellationToken);
    }

    public void Step1_AddItemAndApplyCoupon()
    {
        LogInfo("Step 1 — Add item and apply coupon...");
        _productsPage.Open(_baseUrl);
        _productsPage.WaitUntilLoaded();
        _productsPage.AddToCart("HOODIE-CLASSIC");
        _cartPage.WaitUntilLoaded();
        _cartPage.ApplyCoupon("SAVE10");
        
        AssertUrlContains(_driver, "/cart");
        LogInfo("Step 1 completed.");
    }

    public void Step2_ValidatePricingValues()
    {
        LogInfo("Step 2 — Validate pricing values...");
        
        Assert.Equal(49.00m, _cartPage.Subtotal());
        Assert.Equal(4.90m, _cartPage.Discount());
        Assert.Equal(6.61m, _cartPage.Tax());
        Assert.Equal(50.71m, _cartPage.Total());
        
        LogInfo("Step 2 completed.");
    }

    public void ValidateExpectedResults()
    {
        LogInfo("Validating expected results...");
        
        var subtotal = _cartPage.Subtotal();
        var discount = _cartPage.Discount();
        var tax = _cartPage.Tax();
        var total = _cartPage.Total();

        Assert.Equal(49.00m, subtotal);
        Assert.Equal(4.90m, discount);
        Assert.Equal(6.61m, tax);
        Assert.Equal(50.71m, total);

        LogInfo("Expected results validated successfully.");
    }
}

// Llamada en una clase Test Manager separada
[Fact]
public async Task TC104()
{
    var tc = new TC104_Save10_Discount_Applies_Before_Tax_For_CA_QC(...);
    await tc.PreconditionsAsync();
    tc.Step1_AddItemAndApplyCoupon();
    tc.Step2_ValidatePricingValues();
    tc.ValidateExpectedResults();
}
```

**Características:**
- ✅ Pasos como métodos separados `Step1_()`, `Step2_()`
- ✅ Inyección en constructor
- ✅ Logging manual en cada paso
- ✅ Assertions mezcladas con lógica
- ✅ Preconditions como método separado

---

### Mi Estructura (NUnit)
```csharp
[TestFixture]
[Category("E2E")]
public sealed class TC101_AddProductToCart : BaseTestCase
{
    private IPage _page;
    private ProductBrowsingPage _productBrowsingPage;
    private AddToCartPage _addToCartPage;
    private ProductBrowsingSteps _productBrowsingSteps;
    private AddToCartSteps _addToCartSteps;
    private AddToCartAssertions _addToCartAssertions;

    [OneTimeSetUp]
    public async Task OneTimeSetupAsync()
    {
        Logger.Info("===== Test Suite: Add to Cart E2E Tests =====");
    }

    [SetUp]
    public async Task SetupAsync()
    {
        Logger.Info("[TEST SETUP] Initializing test");
        _page = await _browser.NewPageAsync();
        _productBrowsingPage = new ProductBrowsingPage(_page);
        _addToCartPage = new AddToCartPage(_page);
        // ... etc
    }

    [TearDown]
    public async Task TearDownAsync()
    {
        Logger.Info("[TEARDOWN] Test completed");
    }

    [Test]
    [Category("Smoke")]
    public async Task TC101_AddProductToCart_DefaultQuantity_UpdatesBadge()
    {
        // PRECONDITION
        Logger.Info("├─ PRECONDITION: Verify environment");
        Logger.Info("│  ├─ Base URL: http://127.0.0.1:5174");
        Logger.Info("│  └─ Product ID: 1");

        // STEP 1: Navigate
        Logger.Info("├─ STEP 1: User navigates to product listing");
        Logger.Info("│  └─ Action: Navigate to home page");
        await _productBrowsingSteps.UserNavigatesToProductListingAsync();
        Logger.Info("│  └─ ✓ Product listing ready");

        // STEP 2: Add to Cart
        Logger.Info("├─ STEP 2: User adds product to cart");
        Logger.Info("│  └─ Action: Click 'Add to Cart' button");
        await _addToCartSteps.UserAddsProductToCartAsync(1);
        Logger.Info("│  └─ ✓ Product added");

        // STEP 3: Verify
        Logger.Info("├─ STEP 3: Verify cart badge");
        Logger.Info("│  └─ Action: Get badge count");
        await _addToCartAssertions.CartBadgeShowsCountAsync(1);
        Logger.Info("│  └─ ✓ Badge verified");

        // EXPECTED RESULT
        Logger.Info("└─ EXPECTED RESULT: All verifications passed ✓");
    }
}
```

**Características:**
- ✅ Pasos como métodos en clase separada
- ✅ Inyección via `[SetUp]` atributo
- ✅ Logging con formato jerárquico
- ✅ Assertions en clase Assertions separada
- ✅ Preconditions dentro del test (más claro)

---

## 🔍 Comparación Detallada

### 1. Setup/Teardown

**Xunit (Tu enfoque):**
```csharp
public TC104(...) 
    : base(logger, runId, caseExecutionId, "TC104")
{
    // Setup en constructor
    _driver = driver;
    _productsPage = new ProductsPage(driver, wait);
}
```

**NUnit (Mi enfoque):**
```csharp
[SetUp]
public async Task SetupAsync()
{
    // Setup en método
    Logger.Info("[TEST SETUP] Initializing test");
    _page = await _browser.NewPageAsync();
    _productBrowsingPage = new ProductBrowsingPage(_page);
}

[TearDown]
public async Task TearDownAsync()
{
    // Teardown explícito
    Logger.Info("[TEARDOWN] Test completed");
    if (_page != null) await _page.CloseAsync();
}
```

**Diferencia:**
- Xunit: Setup en constructor (inyección)
- NUnit: Setup en método atributo (más claro qué es setup/teardown)

---

### 2. Pasos de Test

**Xunit (Procedural):**
```csharp
public void Step1_AddItem() { ... }
public void Step2_ApplyCoupon() { ... }
public void Step3_Validate() { ... }

// Ejecución:
await tc.PreconditionsAsync();
tc.Step1_AddItem();
tc.Step2_ApplyCoupon();
tc.Step3_Validate();
```

**NUnit (BDD con Steps reutilizables):**
```csharp
// En AddToCartSteps.cs
public async Task UserAddsProductToCartAsync(int productId) { ... }

// En test:
await _addToCartSteps.UserAddsProductToCartAsync(1);
```

**Diferencia:**
- Xunit: Pasos específicos del test
- NUnit: Steps reutilizables en múltiples tests

---

### 3. Logging

**Xunit (Plano):**
```csharp
LogInfo("Step 1 — Add item and apply coupon...");
LogInfo("Step 1 completed.");
```

**NUnit (Jerárquico):**
```csharp
Logger.Info("├─ STEP 1: User navigates to product listing");
Logger.Info("│  ├─ Action: Navigate to home page");
Logger.Info("│  ├─ Verify: Products grid is loaded");
Logger.Info("│  └─ ✓ Product listing page is ready");
```

**Diferencia:**
- Xunit: Logging simple
- NUnit: Logging estructurado con árboles visuales

---

### 4. Assertions

**Xunit:**
```csharp
Assert.Equal(49.00m, _cartPage.Subtotal());
Assert.Equal(4.90m, _cartPage.Discount());
```

**NUnit:**
```csharp
// En test:
await _addToCartAssertions.CartBadgeShowsCountAsync(1);

// En AddToCartAssertions.cs:
public async Task CartBadgeShowsCountAsync(int expectedCount)
{
    Logger.Info($"  Assert: Cart badge shows {expectedCount}");
    int actualCount = await _addToCartPage.GetCartItemCountAsync();
    Assert.That(actualCount, Is.EqualTo(expectedCount));
    Logger.Info("    ✓ Cart badge count is correct");
}
```

**Diferencia:**
- Xunit: Assertions en el test
- NUnit: Assertions en clase separada (reutilizable)

---

## 🎓 Ventajas de Mi Estructura

### ✅ Reusabilidad
```csharp
// Mismo assertion usado en múltiples tests:
[Test]
public async Task TC101_AddProduct() 
{
    await _addToCartAssertions.CartBadgeShowsCountAsync(1);
}

[Test]
public async Task TC102_AddMultipleProducts() 
{
    await _addToCartAssertions.CartBadgeShowsCountAsync(3);
}

[Test]
public async Task TC103_AddSameProductMultipleTimes() 
{
    await _addToCartAssertions.CartBadgeShowsCountAsync(5);
}
```

### ✅ Debugging Claro
```
[14:23:46] ├─ STEP 1: User navigates to product listing
[14:23:46] │  ├─ Action: Navigate to http://127.0.0.1:5174
[14:23:46] │  ├─ Action: Wait for products grid
[14:23:46] │  └─ ✓ Products loaded (5 items)
[14:23:47] ├─ STEP 2: User adds product to cart
[14:23:47] │  ├─ Action: Get Add to Cart button for product 1
[14:23:47] │  ├─ Action: Click button
[14:23:47] │  └─ ✓ Product added
[14:23:48] ├─ STEP 3: Verify cart badge
[14:23:48] │    Assert: Cart badge shows 1 item(s)
[14:23:48] │    Expected: 1
[14:23:48] │    Actual:   1
[14:23:48] │    ✓ Cart badge count is correct
```

### ✅ Mantenimiento
- Cambiar comportamiento de assertion → una clase
- Cambiar acciones de usuario → una clase
- Locators → una página

---

## 🚀 Recomendación Final

**Usa mi estructura si:**
- ✅ Quieres reutilizar Steps y Assertions
- ✅ Necesitas logging detallado
- ✅ Quieres debugging fácil
- ✅ Trabajas con múltiples tests
- ✅ Necesitas CI/CD robusto

**La estructura de Xunit es mejor si:**
- ✅ Tienes un test muy complejo y único
- ✅ No reutilizarás pasos
- ✅ Prefieres todo en un lugar
- ✅ Proyecto pequeño (< 10 tests)

---

## 📁 Archivos Generados

```
tests_csharp_example/
├── TC101_AddProductToCart.cs          ← Test principal
├── Pages/
│   ├── ProductBrowsingPage.cs         ← Page Object
│   └── AddToCartPage.cs               ← Page Object
├── Steps/
│   ├── ProductBrowsingSteps.cs        ← User Workflows
│   └── AddToCartSteps.cs              ← User Workflows
├── Assertions/
│   └── AddToCartAssertions.cs         ← Verifications
├── Support/
│   ├── Logger.cs                      ← Logging
│   └── BaseTestCase.cs                ← Base Class
└── README_ESTRUCTURA.md               ← Esta documentación
```

---

## ⚡ Quick Start

```bash
# 1. Crear proyecto
dotnet new nunit -n VintageDagoShop.Automation

# 2. Instalar Playwright
dotnet add package Microsoft.Playwright
pwsh bin/Debug/net6.0/playwright.ps1 install

# 3. Copiar archivos de ejemplo
# ... (copiar archivos de tests_csharp_example/)

# 4. Ejecutar tests
dotnet test
# o con categoría
dotnet test --filter "Category=Smoke"
```

¿Quieres que genere más test cases o que refactorice alguno específico?
