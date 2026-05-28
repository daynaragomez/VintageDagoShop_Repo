# 🏗️ VINTAGEDAGOSHOP - PROJECT STRUCTURE

> **Complete technical documentation for development operations**  
> **Last Updated:** 2026-05-27  
> **Version:** 1.1.0

---

## ✅ ACTIVE SERVICES

```
✅ MySQL:        http://localhost:3306          (Database)
✅ Backend API:  http://localhost:3000          (Express REST API)
✅ phpMyAdmin:   http://localhost:8080          (DB Admin Interface)
✅ Frontend:     http://127.0.0.1:5173          (Vite Dev Server)
```

**Docker Containers:**
- `vintagedago_mysql` - MySQL 8.0
- `vintagedago_backend` - Node.js Express API
- `vintagedago_phpmyadmin` - phpMyAdmin 5

---

## 📁 COMPLETE PROJECT STRUCTURE

### Root Directory

```
VintageDagoShop/
├── .github/                    # GitHub configuration
│   └── workflows/
│       └── e2e.yml            # CI/CD pipeline for E2E tests
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── app.js             # Express app configuration (CORS, routes)
│   │   ├── server.js          # Server entry point (port 3000)
│   │   ├── db/
│   │   │   └── connection.js  # MySQL connection pool
│   │   └── routes/
│   │       ├── products.js    # GET /api/products, GET /api/products/:id
│   │       └── orders.js      # POST /api/orders, GET /api/orders, GET /api/orders/:id, PATCH /api/orders/:id/status
│   ├── Dockerfile             # Backend container image
│   ├── package.json           # Backend dependencies (express, mysql2, cors)
│   └── .env.example           # Environment variables template
│
├── database/                   # Database initialization
│   ├── schema.sql             # MySQL schema creation (6 tables)
│   └── seeds.sql              # Initial product data
│
├── dist/                       # Vite build output (generated, not in git)
│
├── docs/                       # Project documentation
│   ├── README.md              # Documentation index
│   ├── PROJECT_STATUS.md      # Current status, scores, roadmap, gaps
│   ├── ARCHITECTURE.md        # System architecture, layers, data flow
│   ├── API_DOCUMENTATION.md   # REST API endpoint contracts
│   ├── DATABASE.md            # Database schema, operations, Docker commands
│   ├── TESTING.md             # Test strategy, frameworks, tags
│   ├── PROJECT_STRUCTURE.md   # This file - folder organization
│   ├── PRD.md                 # Product Requirements Document (10 FRs + 6 NFRs)
│   ├── TRACEABILITY.md        # Requirements → Implementation → Tests mapping
│   ├── SDD-AUDIT-REPORT.md    # Complete SDD compliance audit
│   ├── DOCUMENTATION-ALIGNMENT-REPORT.md  # Documentation gap analysis
│   ├── DOCUMENTATION_ANALYSIS_REPORT.md   # Documentation accuracy audit
│   ├── DOCUMENTATION_UPDATE_LOG.md        # P0 critical fixes log
│   └── ai-audit-prompt.md     # SDD framework reference
│
├── node_modules/               # Frontend dependencies (generated, not in git)
│
├── public/                     # Static assets
│   └── images/
│       └── products/           # Product images (currently empty - uses placeholder URLs)
│
├── src/                        # Frontend React application
│   ├── App.jsx                # Main app component with router
│   ├── App.css                # Global app styles
│   ├── main.jsx               # React root entry point
│   ├── index.css              # Global CSS reset
│   │
│   ├── application/            # ⚠️ EMPTY - Intended for use cases/services (Clean Architecture)
│   │   ├── services/          # ⚠️ EMPTY
│   │   ├── usecases/          # ⚠️ EMPTY
│   │   └── validators/        # ⚠️ EMPTY
│   │
│   ├── context/               # React Context providers
│   │   └── CartContext.jsx    # Cart state management (add/remove/update, localStorage persistence)
│   │
│   ├── domain/                # ⚠️ EMPTY - Intended for entities/repositories (Clean Architecture)
│   │   ├── entities/          # ⚠️ EMPTY
│   │   └── repositories/      # ⚠️ EMPTY
│   │
│   ├── infrastructure/        # External integrations
│   │   ├── api/
│   │   │   ├── productService.js   # fetchProducts(), fetchProduct(id)
│   │   │   └── orderService.js     # placeOrder(), fetchOrders(), fetchOrder(id), updateOrderStatus()
│   │   ├── repositories/      # ⚠️ EMPTY - Intended for repository implementations
│   │   └── storage/           # ⚠️ EMPTY - Intended for localStorage abstraction
│   │
│   ├── presentation/          # UI layer
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Navbar/
│   │   │           ├── Navbar.jsx    # Navigation bar with cart badge
│   │   │           └── Navbar.css
│   │   ├── hooks/             # ⚠️ EMPTY - Intended for custom React hooks
│   │   └── pages/             # Routed page components
│   │       ├── HomePage/
│   │       │   ├── HomePage.jsx      # Product catalog with search/filter
│   │       │   └── HomePage.css
│   │       ├── ProductPage/
│   │       │   ├── ProductPage.jsx   # Product detail view
│   │       │   └── ProductPage.css
│   │       ├── CartPage/
│   │       │   ├── CartPage.jsx      # Cart review with quantity controls
│   │       │   └── CartPage.css
│   │       ├── CheckoutPage/
│   │       │   ├── CheckoutPage.jsx  # Customer info form + order placement
│   │       │   └── CheckoutPage.css
│   │       ├── ConfirmationPage/
│   │       │   ├── ConfirmationPage.jsx  # Order success message
│   │       │   └── ConfirmationPage.css
│   │       ├── AdminOrdersPage/
│   │       │   ├── AdminOrdersPage.jsx   # Admin order dashboard
│   │       │   └── AdminOrdersPage.css
│   │       └── AdminOrderDetailPage/
│   │           ├── AdminOrderDetailPage.jsx  # Admin order detail + status update
│   │           └── AdminOrderDetailPage.css
│   │
│   └── shared/                # Shared utilities
│       ├── constants/         # ⚠️ EMPTY - Intended for app constants
│       ├── data/
│       │   └── products.js    # ⚠️ UNUSED - Static product data (not imported anywhere)
│       ├── helpers/           # ⚠️ EMPTY - Intended for helper functions
│       └── utils/             # ⚠️ EMPTY - Intended for utility functions
│
├── tests/                      # Test suites
│   ├── e2e/                   # Playwright E2E tests (Page Object Model)
│   │   ├── api/
│   │   │   ├── orderApiClient.js      # Playwright request context for orders API
│   │   │   └── productApiClient.js    # Playwright request context for products API
│   │   ├── assertions/        # Centralized expect() calls
│   │   │   ├── CartAssertions.js
│   │   │   ├── CheckoutAssertions.js
│   │   │   ├── ConfirmationAssertions.js
│   │   │   ├── HomeAssertions.js
│   │   │   └── ProductAssertions.js
│   │   ├── db/
│   │   │   └── dbHelper.js    # Database reset helper (execSync docker exec)
│   │   ├── pages/             # Page Object Model classes
│   │   │   ├── BasePage.js
│   │   │   ├── HomePage.js
│   │   │   ├── ProductPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   └── ConfirmationPage.js
│   │   ├── specs/             # Test suites (thin - call steps + assertions only)
│   │   │   ├── home.spec.js       # @smoke, @ui, @home
│   │   │   ├── product.spec.js    # @ui, @product
│   │   │   ├── cart.spec.js       # @ui, @cart
│   │   │   ├── checkout.spec.js   # @ui, @checkout, @validation
│   │   │   ├── e2e-flow.spec.js   # @e2e, @critical, @smoke
│   │   │   └── api.spec.js        # @api, @smoke, @critical, @inventory
│   │   ├── steps/             # Action orchestration (no assertions)
│   │   │   ├── HomeSteps.js
│   │   │   ├── ProductSteps.js
│   │   │   ├── CartSteps.js
│   │   │   └── CheckoutSteps.js
│   │   └── utils/
│   │       ├── constants.js   # Test constants (URLs, timeouts)
│   │       └── testData.js    # Test data fixtures
│   │
│   ├── fixtures/
│   │   └── index.js           # Playwright custom fixtures (pages, steps, assertions, api, db)
│   │
│   ├── integration/
│   │   └── cart-flow.test.jsx # Vitest integration test for cart flow
│   │
│   ├── unit/                  # Vitest unit tests
│   │   ├── components/
│   │   │   └── HomePage.test.jsx
│   │   └── context/
│   │       └── CartContext.test.jsx
│   │
│   └── setup.js               # Vitest test setup configuration
│
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .eslintignore               # ESLint ignore patterns
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore patterns
├── .prettierrc.json            # Prettier code formatter config
├── docker-compose.yml          # Multi-container Docker setup (MySQL + Backend + phpMyAdmin)
├── index.html                  # Vite HTML entry point
├── LICENSE                     # MIT License
├── package.json                # Frontend dependencies + scripts
├── package-lock.json           # Locked dependency versions
├── playwright.config.js        # Playwright E2E test configuration
├── README.md                   # Main project README
└── vite.config.js              # Vite build tool configuration
```

---

## 📂 DIRECTORY PURPOSES

### Frontend (`src/`)

| Directory | Purpose | Status |
|---|---|---|
| `application/` | **Use cases, application services, validators** (Clean Architecture) | ⚠️ EMPTY - Technical debt |
| `context/` | React Context providers for global state | ✅ Active - CartContext |
| `domain/` | **Business entities, value objects, domain services** (Clean Architecture) | ⚠️ EMPTY - Technical debt |
| `infrastructure/api/` | External API integrations (fetch wrappers) | ✅ Active - productService, orderService |
| `infrastructure/repositories/` | Repository pattern implementations | ⚠️ EMPTY - Intended for future use |
| `infrastructure/storage/` | localStorage abstraction | ⚠️ EMPTY - Intended for future use |
| `presentation/components/` | Reusable UI components | ✅ Active - Navbar |
| `presentation/hooks/` | Custom React hooks | ⚠️ EMPTY - Intended for future use |
| `presentation/pages/` | Routed page components | ✅ Active - 7 pages |
| `shared/constants/` | Application constants | ⚠️ EMPTY |
| `shared/data/` | Static data files | ⚠️ Contains unused products.js |
| `shared/helpers/` | Helper functions | ⚠️ EMPTY |
| `shared/utils/` | Utility functions | ⚠️ EMPTY |

### Backend (`backend/src/`)

| Directory | Purpose | Status |
|---|---|---|
| `db/` | Database connection pool | ✅ Active - MySQL connection |
| `routes/` | Express route handlers | ✅ Active - products, orders |

### Tests (`tests/`)

| Directory | Purpose | Status |
|---|---|---|
| `e2e/api/` | API client wrappers for tests | ✅ Active - 2 clients |
| `e2e/assertions/` | Centralized expect() calls | ✅ Active - 5 assertion classes |
| `e2e/db/` | Database helpers | ✅ Active - dbHelper |
| `e2e/pages/` | Page Object Model | ✅ Active - 6 page objects |
| `e2e/specs/` | Test suites | ✅ Active - 6 spec files (~31 tests) |
| `e2e/steps/` | Action orchestration | ✅ Active - 4 step classes |
| `e2e/utils/` | Test utilities | ✅ Active - constants, testData |
| `fixtures/` | Playwright custom fixtures | ✅ Active |
| `integration/` | Integration tests | ✅ Active - cart-flow.test.jsx |
| `unit/` | Unit tests | ⚠️ Minimal - 2 test files |

---

## 🏷️ NAMING CONVENTIONS

### Files
- **React Components:** PascalCase (e.g., `HomePage.jsx`, `CartContext.jsx`)
- **Test Files:** kebab-case with `.test.jsx` or `.spec.js` suffix
- **API Services:** camelCase with `Service` suffix (e.g., `productService.js`)
- **CSS Files:** Match component name (e.g., `HomePage.css`)

### Code
- **Components:** PascalCase functions (e.g., `function HomePage()`)
- **Functions:** camelCase (e.g., `fetchProducts()`, `addToCart()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `BASE_URL`, `PAGE_SIZE`)
- **Variables:** camelCase (e.g., `cartItems`, `productId`)

### Test IDs
- **Format:** kebab-case with descriptive names
- **Examples:** `data-testid="search-input"`, `data-testid="product-detail-name"`

---

## 🔗 FILE ORGANIZATION PRINCIPLES

1. **Co-location:** Component CSS files live next to component JSX files
2. **Page Components:** Each page has its own directory with JSX + CSS
3. **No Barrel Exports:** Direct imports (no index.js re-exports)
4. **Test Structure:** Mirrors src/ structure for easy navigation
5. **Clean Architecture Folders:** Exist but are empty (documented as technical debt)

---

## ⚠️ EMPTY FOLDERS (Technical Debt)

The following folders exist but contain no files:

**Frontend:**
- `src/application/services/`
- `src/application/usecases/`
- `src/application/validators/`
- `src/domain/entities/`
- `src/domain/repositories/`
- `src/infrastructure/repositories/`
- `src/infrastructure/storage/`
- `src/presentation/hooks/`
- `src/shared/constants/`
- `src/shared/helpers/`
- `src/shared/utils/`

**Status:** Documented in docs/PROJECT_STATUS.md as Gap #7  
**Decision Pending:** Either implement Clean Architecture or remove empty folders

---

## 📝 NOTES

- **Static Data File:** `src/shared/data/products.js` exists but is **NOT USED** (no imports found)
- **Admin Routes:** Unprotected (no authentication) - documented as Gap #6
- **Test Coverage:** Unknown (needs npm run test:coverage) - documented as Gap #5
- **Architecture:** Currently 3-tier, not Clean Architecture despite folder structure

---

**Document Owner:** Tech Lead  
**Last Review:** 2026-05-27  
**Next Review:** After Clean Architecture decision (Gap #7)