# VintageDagoShop

E-commerce web app for vintage clothing. React 18 frontend, Express backend, MySQL 8 via Docker.

**📊 Project Status**: ✅ 85% implemented | 🔴 Critical gap: frontend admin auth flow | 🟠 Performance monitoring  
**📚 Documentation**: [Full Index](./MASTER_INDEX.md) | [Roadmap](./ROADMAP.md) | [Production Plan](./PRODUCTION_READINESS_PLAN.md) | [Decision Framework](./DECISION_FRAMEWORK.md)
**🌐 Documentation Language**: English only for active documentation

### ⚡ Quick Navigation (First Time?)
- **New to project?** → [START_HERE.md](./START_HERE.md) (5 min read)
- **Want to go live?** → [PRODUCTION_READINESS_PLAN.md](./PRODUCTION_READINESS_PLAN.md) (2-3 weeks)
- **Need implementation history?** → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) (full consolidation + rationale)
- **Need testing structure expansion?** → [FOLDER_EXPANSION_PLAN.md](./FOLDER_EXPANSION_PLAN.md) (phase-based plan)
- **Confused what to do next?** → [DECISION_FRAMEWORK.md](./DECISION_FRAMEWORK.md) (3 clear options)

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express |
| Database | MySQL 8 (Docker) |
| Testing | Playwright 1.60 (E2E), Vitest (unit/integration) |

## Prerequisites

- Node.js 16+
- Docker Desktop

## Start the app

```bash
# 1. Start database and backend
docker-compose up -d --build

# 2. Install frontend dependencies (first time only)
npm install

# 3. Start frontend dev server
npm run dev
# → http://localhost:5173
```

## Pages

| Route | Page |
|---|---|
| `/` | Home — product grid |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/checkout` | Checkout form |
| `/confirmation` | Order confirmation |
| `/admin/orders` | Admin — order management dashboard |
| `/admin/orders/:id` | Admin — order detail & status update |

## Scripts

```bash
npm run dev            # start Vite dev server
npm run build          # production build
npm run lint           # ESLint
npm test               # Vitest unit + integration
npm run test:e2e       # Playwright E2E suite
```

## E2E Test Tags

Run a subset of tests by tag:

```bash
npx playwright test --grep "@smoke"       # fast critical-path
npx playwright test --grep "@api"         # API contract tests only
npx playwright test --grep "@e2e"         # full purchase flows
npx playwright test --grep "@validation"  # form validation
npx playwright test --grep "@checkout"    # checkout feature area
```

| Tag | Scope |
|---|---|
| `@smoke` | Fast, must-pass on every run |
| `@ui` | Browser UI interaction |
| `@api` | Backend API contract |
| `@e2e` | Full user journey |
| `@critical` | Core business logic |
| `@validation` | Form error handling |
| `@boundary` | Edge cases (stock limits) |
| `@inventory` | Stock decrement consistency |
| `@home` `@product` `@cart` `@checkout` | Feature area |

## Documentation

| Purpose | Location | Read time |
|---------|----------|-----------|
| **📌 Start here** | [MASTER_INDEX.md](./MASTER_INDEX.md) | 5 min |
| **🗺️ What's implemented vs what's missing** | [ROADMAP.md](./ROADMAP.md) | 10 min |
| **🚀 Action plan to production** | [PRODUCTION_READINESS_PLAN.md](./PRODUCTION_READINESS_PLAN.md) | 15 min |
| **📚 Full docs by role** | [docs/DOCUMENTATION_INDEX_BY_ROLE.md](./docs/DOCUMENTATION_INDEX_BY_ROLE.md) | 3 min |
| **🏗️ System architecture** | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 10 min |
| **📖 Product requirements** | [docs/PRD.md](./docs/PRD.md) | 15 min |
| **🧪 Testing & framework** | [docs/TESTING.md](./docs/TESTING.md) + [docs/framework/IMPLEMENTATION_PLAN.md](./docs/framework/IMPLEMENTATION_PLAN.md) | 20 min |
| **🧭 Decision support** | [DECISION_FRAMEWORK.md](./DECISION_FRAMEWORK.md) | 5 min |
| **🧱 Test structure expansion** | [FOLDER_EXPANSION_PLAN.md](./FOLDER_EXPANSION_PLAN.md) | 10 min |
| **📝 Consolidation history** | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | 20-30 min |
| **🚀 Deployment** | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 5 min |

---

## 🚨 Critical Status

```bash
# First time / full reset — destroys volume and re-applies schema + seeds
docker-compose down -v
docker-compose up -d --build

# Reset stock and clear orders (deterministic test state, keeps DB running)
docker exec vintagedago_mysql mysql -uvintagedago_user -psecret vintagedago \
  -e "UPDATE products SET stock=5 WHERE name='Vintage Leather Jacket'; \
      UPDATE products SET stock=8 WHERE name='Retro Denim Jeans'; \
      UPDATE products SET stock=12 WHERE name='Vintage Band T-Shirt'; \
      DELETE FROM order_items; DELETE FROM orders; \
      DELETE FROM addresses; DELETE FROM customers;"

# Stop containers (keeps data volume)
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f mysql

# phpMyAdmin — visual table browser
# http://localhost:8080   user: vintagedago_user   pass: secret
```

## Project structure

```
src/
  context/                  CartContext — global cart state
  infrastructure/api/       productService — fetch wrapper
  presentation/
    components/layout/      Navbar
    pages/                  HomePage, ProductPage, CartPage, CheckoutPage, ConfirmationPage

database/
  init.sql                  Schema creation
  seeds.sql                 Initial product data

tests/
  fixtures/                 Playwright custom fixtures (pages, steps, assertions, api, db)
  e2e/
    pages/                  Page Objects (data-testid locators only)
    steps/                  Action orchestration
    assertions/             Centralized expect() calls
    api/                    productApiClient, orderApiClient
    db/                     dbHelper — DB reset helper
    utils/                  constants, testData
    specs/                  Test suites (thin — call steps + assertions only)

.github/workflows/e2e.yml   CI pipeline
docker-compose.yml          MySQL + Express + phpMyAdmin
playwright.config.js        Playwright configuration
```

## Prices

All prices are stored in the `products` MySQL table and read from `GET /api/products`. Nothing is hardcoded in the frontend.

## 📁 Project Structure

```
src/                   ← React frontend (Clean Architecture)
├── presentation/      ← UI components & pages
├── application/       ← Business logic
├── domain/            ← Entities & interfaces
├── infrastructure/    ← API calls
└── context/           ← State management

backend/src/           ← Express backend
├── routes/            ← API endpoints
├── middleware/        ← Auth, CORS, validation
└── db/                ← Database connection

tests/                 ← Testing
├── e2e/               ← Playwright E2E tests
├── integration/       ← API + DB tests
├── unit/              ← Component tests
├── fixtures/          ← Test data
└── utils/             ← Test helpers
```

**✅ Structure planning**: [See FOLDER_EXPANSION_PLAN.md](./FOLDER_EXPANSION_PLAN.md) for the phase-based testing structure expansion plan.

## Repository

https://github.com/daynaragomez/VintageDagoShop_Repo

---

## 🚨 Critical Gaps (Production Blockers)

| Gap | Severity | Impact | Timeline |
|-----|----------|--------|----------|
| **Frontend admin auth flow incomplete** | 🔴 CRITICAL | Admin UI cannot complete protected workflow end-to-end | 4-6h |
| **Performance not measured** | 🟠 MEDIUM | No SLA visibility | 4-6h |
| **Search & filtering missing** | 🟠 MEDIUM | Poor UX for discovery | 4-5h |
| **Deployment undocumented** | 🟠 MEDIUM | Manual deployment risk | 5-7h |

**👉 [See ROADMAP.md for detailed implementation plan](./ROADMAP.md)**

---

## ?? Project Status

**Implementation**: ✅ 85% (Core ecommerce flows done)  
**Testing**: ✅ 88% (Excellent Playwright framework)  
**Security**: 🟠 Partial (backend protection exists, frontend auth flow incomplete)  
**Performance**: 🟠 60% (Not measured)  
**Overall Score**: 77/100 (Good, but production-blocked)

For complete status, see:
- **[ROADMAP.md](./ROADMAP.md)** - What's done, what's missing, prioritized roadmap
- **[MASTER_INDEX.md](./MASTER_INDEX.md)** - Full documentation navigation
- **[docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - Detailed current phase
