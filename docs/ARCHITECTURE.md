# Architecture

## Overview

```
React :5173  →  fetch /api/*  →  Express :3000  →  mysql2  →  MySQL :3306
```

The frontend is a React SPA with client-side routing. The backend is a thin Express API that owns all data mutations. The database is the single source of truth for product stock.

## Frontend layers

```
presentation/pages      Routed page components (HomePage, ProductPage, CartPage, etc.)
presentation/components Shared UI (Navbar)
context/                CartContext — client-side cart state (localStorage-backed)
infrastructure/api/     productService, orderService — all fetch calls to backend API
```

**Data Flow:**
- **Products:** Fetched from `GET /api/products` via `fetchProducts()` in productService.js
  - HomePage.jsx uses `fetchProducts()` to display product catalog
  - ProductPage.jsx uses `fetchProduct(id)` to display product details
  - ⚠️ Note: `src/shared/data/products.js` exists but is **NOT USED** (appears to be unused/leftover code)
- **Cart:** Managed in React Context (CartContext), persisted to `localStorage` per session
- **Orders:** Submitted via `POST /api/orders` in orderService.js

Cart state lives in React context, persisted to `localStorage` per session. On order submission the backend inserts customer, address, and order records atomically and decrements stock. The frontend re-fetches product data from the API — no local stock tracking.

## Backend

Single Express router at `backend/`. Key endpoints:

```
GET  /api/products        list all products with current stock
GET  /api/products/:id    single product
POST /api/orders          place order — inserts customer + address + order in a transaction,
                          decrements stock with row-level locks, returns 400 if stock insufficient
```

POST /api/orders response:
```json
{ "orderId": 7, "subtotal": 89.99, "tax": 13.50, "total": 103.49 }
```

## Database schema (3NF)

```
categories  (id, name, slug)
products    (id, name, description, details, price, stock, category_id → categories, image, created_at)
customers   (id, name, email, phone, created_at)
addresses   (id, customer_id → customers, street, city, state, zip_code, country, created_at)
orders      (id, customer_id → customers, address_id → addresses, subtotal, tax, total, status, created_at)
order_items (id, order_id → orders, product_id → products, quantity, unit_price)
```

Stock decrement is wrapped in a MySQL transaction with `FOR UPDATE` row-level locks to prevent overselling.

## Test automation layers

```
specs           thin — describe/test blocks with steps + assertions only
steps           action orchestration (no assertions)
assertions      all expect() calls centralized per page
pages           Playwright Page Objects — data-testid locators and actions only
fixtures        custom test fixture that injects all layers + DB reset
api/            Playwright request context clients for setup and contract checks
db/             dbHelper — execSync docker exec for deterministic DB state
```

No raw `expect()` calls appear in spec files. No `page.waitForTimeout()` anywhere — all waits are condition-based (`waitFor({ state })`, `waitForURL`, `waitForFunction`).

---

## Clean Architecture: Intention vs Reality

### Folder Structure Claims

The project includes `src/domain/` and `src/application/` directories (Clean Architecture pattern), suggesting a domain-driven design with business logic separated from infrastructure:

```
src/
  domain/          ← Business entities, value objects, domain services
    entities/      ← EMPTY
    repositories/  ← EMPTY
  application/     ← Use cases, application services
    services/      ← EMPTY
    usecases/      ← EMPTY
    validators/    ← EMPTY
```

### Actual Implementation

**All of these directories are currently EMPTY.** The implemented architecture is a **traditional 3-tier presentation-infrastructure-data architecture**, not Clean Architecture:

**Current Architecture:**
- **Presentation Layer:** `src/presentation/` (pages, components, Navbar)
- **Infrastructure Layer:** `src/infrastructure/api/` (productService, orderService - thin API clients)
- **Data Layer:** `backend/src/` (Express API, direct database access via mysql2)

**Business Logic Location:**
- Cart logic: `src/context/CartContext.jsx` (React Context - presentation layer)
- Order placement logic: `backend/src/routes/orders.js` (backend - mixed with data access)
- No domain entities, no use cases, no application services

### Why This Matters

**Pros of Current Approach:**
- ✅ Simple and pragmatic for current project scope
- ✅ Low overhead - no extra abstraction layers
- ✅ Easy to understand for new developers
- ✅ Fast development velocity

**Cons of Current Approach:**
- ⚠️ Business logic mixed with data access (orders.js does both)
- ⚠️ Cart logic in React Context (hard to reuse for React Native)
- ⚠️ No domain model (products, orders, customers are just JSON)
- ⚠️ Validation scattered (frontend and backend)

### Path Forward

**Option A: Implement Clean Architecture**
- Move business logic to `src/application/usecases/`
- Create domain entities in `src/domain/entities/`
- Implement repository interfaces in `src/domain/repositories/`
- Implement repository adapters in `src/infrastructure/repositories/`
- Extract validators to `src/application/validators/`

**Option B: Accept 3-Tier and Clean Up**
- Remove empty `domain/` and `application/` folders
- Document as 3-tier architecture in all docs
- Keep current pragmatic approach
- Add domain layer only when business logic becomes complex

**Recommendation:** Option B for now. The project scope is simple (e-commerce MVP with ~10 products). Clean Architecture overhead is not justified unless:
1. Business logic becomes significantly more complex
2. Multiple frontend clients needed (web + mobile + desktop)
3. Domain model requires complex validation rules

### Status

**Current Status:** Documented as Technical Debt (Gap #7 in PROJECT_STATUS.md)  
**Decision Required:** Choose Option A or B before Phase 2
