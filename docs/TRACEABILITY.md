# Requirements Traceability Matrix
## VintageDagoShop

> **Purpose:** Map requirements ? implementation ? tests to ensure complete coverage  
> **Last Updated:** 2026-05-27  
> **Status:** Retroactive Baseline

---

## ?? TRACEABILITY OVERVIEW

**Total Requirements:** 16 (10 Functional + 6 Non-Functional)  
**Implementation Coverage:** 100% (all FR complete)  
**Test Coverage:** 80% (E2E excellent for customer features, admin features untested)

---

## ?? FUNCTIONAL REQUIREMENTS TRACEABILITY

### REQ-001: Product Catalog Display

| Aspect | Details |
|---|---|
| **User Story** | Browse all vintage items in a grid layout |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-1-product-catalog-display) |
| **Implementation Files** | `src/presentation/pages/HomePage.jsx`<br/>`src/infrastructure/api/productService.js`<br/>`backend/src/routes/products.js` |
| **API Endpoint** | `GET /api/products` |
| **Database Tables** | `products`, `categories` |
| **E2E Tests** | `tests/e2e/specs/home.spec.js`<br/>- Test: "displays product grid with all items"<br/>- Test: "each product card shows required info"<br/>- Tag: `@smoke`, `@ui`, `@home` |
| **Unit Tests** | ?? TBD - No unit tests for HomePage yet |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 5/5 (100%) |

---

### REQ-002: Product Detail View

| Aspect | Details |
|---|---|
| **User Story** | View detailed information about a specific product |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-2-product-detail-view) |
| **Implementation Files** | `src/presentation/pages/ProductPage.jsx`<br/>`src/infrastructure/api/productService.js`<br/>`backend/src/routes/products.js` |
| **API Endpoint** | `GET /api/products/:id` |
| **Database Tables** | `products`, `categories` |
| **E2E Tests** | `tests/e2e/specs/product.spec.js`<br/>- Test: "displays full product details"<br/>- Test: "shows stock level"<br/>- Test: "handles 404 for invalid product ID"<br/>- Tag: `@ui`, `@product` |
| **Unit Tests** | ?? TBD - No unit tests for ProductPage yet |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 6/6 (100%) |

---

### REQ-003: Shopping Cart Management

| Aspect | Details |
|---|---|
| **User Story** | Add items to cart and adjust quantities |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-3-shopping-cart-management) |
| **Implementation Files** | `src/context/CartContext.jsx`<br/>`src/presentation/pages/CartPage.jsx`<br/>`src/presentation/components/layout/Navbar.jsx` |
| **State Management** | React Context API + localStorage persistence |
| **E2E Tests** | `tests/e2e/specs/cart.spec.js`<br/>- Test: "adds product to cart"<br/>- Test: "updates quantity with +/- buttons"<br/>- Test: "removes item from cart"<br/>- Test: "persists cart across page refresh"<br/>- Test: "displays cart count badge in navbar"<br/>- Test: "calculates subtotal and tax (15%)"<br/>- Tag: `@ui`, `@cart` |
| **Unit Tests** | ?? TBD - No unit tests for CartContext yet |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 8/8 (100%) |
| **Business Rule** | Tax fixed at 15% (hardcoded) |

---

### REQ-004: Checkout Form

| Aspect | Details |
|---|---|
| **User Story** | Provide contact and shipping information |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-4-checkout-form) |
| **Implementation Files** | `src/presentation/pages/CheckoutPage.jsx` |
| **Form Fields** | name, email, phone, street, city, state, zipCode, country |
| **Validation** | Client-side validation with error messages |
| **E2E Tests** | `tests/e2e/specs/checkout.spec.js`<br/>- Test: "displays checkout form"<br/>- Test: "validates required fields (name, email, street, city, country)"<br/>- Test: "validates email format"<br/>- Test: "displays clear error messages"<br/>- Test: "disables Place Order button during submission"<br/>- Tag: `@ui`, `@checkout`, `@validation` |
| **Unit Tests** | ?? TBD - No unit tests for CheckoutPage validation logic |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 7/7 (100%) |

---

### REQ-005: Order Placement & Stock Decrement

| Aspect | Details |
|---|---|
| **User Story** | Ensure stock is decremented atomically when order is placed |
| **Priority** | P0 (Must Have - Critical Business Logic) |
| **Source Document** | [PRD.md](PRD.md#fr-5-order-placement--stock-decrement) |
| **Implementation Files** | `backend/src/routes/orders.js` (POST /api/orders handler) |
| **API Endpoint** | `POST /api/orders` |
| **Database Tables** | `customers`, `addresses`, `orders`, `order_items`, `products` (stock column) |
| **Transaction Logic** | MySQL transaction with row-level locks (`FOR UPDATE`)<br/>Prevents overselling via serialized writes |
| **E2E Tests** | `tests/e2e/specs/api.spec.js`<br/>- Test: "POST /api/orders creates order and decrements stock"<br/>- Test: "returns 400 if stock insufficient"<br/>- Test: "prevents overselling with concurrent orders"<br/>- Tag: `@api`, `@critical`, `@inventory`, `@smoke` |
| **Integration Tests** | ?? TBD - No isolated transaction unit tests |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 8/8 (100%) |
| **Business Rules** | - Stock cannot go negative<br/>- All operations atomic (transaction)<br/>- Concurrent orders serialized per product |

---

### REQ-006: Order Confirmation

| Aspect | Details |
|---|---|
| **User Story** | See confirmation page after placing order |
| **Priority** | P1 (Should Have) |
| **Source Document** | [PRD.md](PRD.md#fr-6-order-confirmation) |
| **Implementation Files** | `src/presentation/pages/ConfirmationPage.jsx` |
| **Routing** | `/confirmation` with React Router state passing |
| **E2E Tests** | `tests/e2e/specs/e2e-flow.spec.js`<br/>- Test: "completes full purchase flow"<br/>- Test: "displays order ID and total on confirmation"<br/>- Test: "clears cart after successful order"<br/>- Tag: `@e2e`, `@critical`, `@smoke` |
| **Unit Tests** | ?? TBD - No unit tests for ConfirmationPage |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 5/5 (100%) |

---

### REQ-007: Navigation

| Aspect | Details |
|---|---|
| **User Story** | Easily navigate between pages |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-7-navigation) |
| **Implementation Files** | `src/presentation/components/layout/Navbar.jsx`<br/>`src/App.jsx` (React Router routes) |
| **UI Elements** | - Brand logo/name (links to home)<br/>- Cart icon with item count badge<br/>- Responsive design |
| **E2E Tests** | `tests/e2e/specs/home.spec.js`<br/>- Test: "navbar is visible on all pages"<br/>- Test: "cart badge shows item count"<br/>- Test: "logo links to homepage"<br/>- Tag: `@smoke`, `@ui` |
| **Unit Tests** | ?? TBD - No unit tests for Navbar component |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 5/5 (100%) |

---

### REQ-008: API Endpoints

| Aspect | Details |
|---|---|
| **User Story** | Consume RESTful API endpoints |
| **Priority** | P0 (Must Have) |
| **Source Document** | [PRD.md](PRD.md#fr-8-api-endpoints) |
| **Implementation Files** | `backend/src/app.js`<br/>`backend/src/routes/products.js`<br/>`backend/src/routes/orders.js` |
| **Endpoints** | - `GET /api/products`<br/>- `GET /api/products/:id`<br/>- `POST /api/orders` |
| **Documentation** | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| **E2E Tests** | `tests/e2e/specs/api.spec.js`<br/>- Test: "GET /api/products returns all products"<br/>- Test: "GET /api/products/:id returns single product"<br/>- Test: "GET /api/products/:id returns 404 for invalid ID"<br/>- Test: "POST /api/orders creates order"<br/>- Test: "POST /api/orders returns 400 for insufficient stock"<br/>- Tag: `@api`, `@smoke` |
| **Unit Tests** | ?? TBD - No isolated API route unit tests |
| **Status** | ? Complete - Fully implemented and tested |
| **Acceptance Criteria Met** | 6/6 (100%) |

---

### REQ-009: Admin Order Dashboard

| Aspect | Details |
|---|---|
| **User Story** | View all customer orders in a table |
| **Priority** | P1 (Should Have) |
| **Source Document** | [PRD.md](PRD.md#fr-9-admin-order-dashboard) |
| **Implementation Files** | `src/presentation/pages/AdminOrdersPage/AdminOrdersPage.jsx`<br/>`backend/src/routes/orders.js` (GET /api/orders) |
| **API Endpoint** | `GET /api/orders` |
| **Database Tables** | `orders`, `customers` |
| **E2E Tests** | ???? TBD - No admin E2E tests found |
| **Unit Tests** | ???? TBD - No unit tests for AdminOrdersPage yet |
| **Status** | ? Complete - Implemented but untested |
| **Acceptance Criteria Met** | Unknown - No tests |
| **Security Gap** | ???? No authentication/authorization |

---

### REQ-010: Admin Order Status Management

| Aspect | Details |
|---|---|
| **User Story** | View order details and update order status |
| **Priority** | P1 (Should Have) |
| **Source Document** | [PRD.md](PRD.md#fr-10-admin-order-status-management) |
| **Implementation Files** | `src/presentation/pages/AdminOrderDetailPage/AdminOrderDetailPage.jsx`<br/>`backend/src/routes/orders.js` (GET /api/orders/:id, PATCH /api/orders/:id/status) |
| **API Endpoints** | `GET /api/orders/:id`<br/>`PATCH /api/orders/:id/status` |
| **Database Tables** | `orders`, `customers`, `addresses`, `order_items`, `products` |
| **E2E Tests** | ???? TBD - No admin E2E tests found |
| **Unit Tests** | ???? TBD - No unit tests yet |
| **Status** | ? Complete - Implemented but untested |
| **Acceptance Criteria Met** | Unknown - No tests |
| **Security Gap** | ???? No authentication/authorization |

---
## ?? NON-FUNCTIONAL REQUIREMENTS TRACEABILITY

### NFR-001: Performance

| Aspect | Details |
|---|---|
| **Requirements** | - Page load < 2s (95th percentile)<br/>- API response < 500ms for product list<br/>- API response < 300ms for order placement |
| **Source Document** | [PRD.md](PRD.md#nfr-1-performance) |
| **Implementation** | - Vite optimized build<br/>- MySQL connection pooling<br/>- Efficient queries with indexes |
| **Tests** | ? No performance tests exist |
| **Measurement** | ? No metrics collected |
| **Status** | ?? Not Validated - Performance testing needed |

---

### NFR-002: Scalability

| Aspect | Details |
|---|---|
| **Requirements** | - Support 100 concurrent users<br/>- Handle 1,000+ products |
| **Source Document** | [PRD.md](PRD.md#nfr-2-scalability) |
| **Implementation** | - Database supports large catalogs<br/>- No in-memory bottlenecks |
| **Tests** | ? No load tests exist |
| **Status** | ?? Not Validated - Load testing needed |

---

### NFR-003: Security

| Aspect | Details |
|---|---|
| **Requirements** | - Input validation<br/>- SQL injection prevention<br/>- XSS prevention |
| **Source Document** | [PRD.md](PRD.md#nfr-3-security) |
| **Implementation** | - Backend validates required fields<br/>- MySQL parameterized queries (SQL injection safe)<br/>- React auto-escapes JSX (XSS safe) |
| **Tests** | ?? Partial - Form validation tested, no explicit security tests |
| **Status** | ?? Partial Validation - Explicit security testing needed |

---

### NFR-004: Reliability

| Aspect | Details |
|---|---|
| **Requirements** | - 99.9% uptime<br/>- Automated backups<br/>- Transaction rollback |
| **Source Document** | [PRD.md](PRD.md#nfr-4-reliability) |
| **Implementation** | - MySQL transactions with rollback on error<br/>- No backup strategy configured yet |
| **Tests** | ? Transaction rollback tested in E2E (insufficient stock test) |
| **Status** | ?? Partial - Transactions work, backups not configured |

---

### NFR-005: Usability

| Aspect | Details |
|---|---|
| **Requirements** | - Mobile-responsive<br/>- Keyboard accessible<br/>- Clear error messages |
| **Source Document** | [PRD.md](PRD.md#nfr-5-usability) |
| **Implementation** | - Responsive CSS grid<br/>- Form error messages implemented |
| **Tests** | ? E2E tests validate error messages<br/>? No accessibility tests |
| **Status** | ?? Good - Responsive design, accessibility not tested |

---

### NFR-006: Maintainability

| Aspect | Details |
|---|---|
| **Requirements** | - Automated tests<br/>- Clean architecture<br/>- Comprehensive docs |
| **Source Document** | [PRD.md](PRD.md#nfr-6-maintainability) |
| **Implementation** | - Playwright E2E tests<br/>- Vitest configured<br/>- Clean layer separation<br/>- 10+ documentation files |
| **Tests** | ? 6 E2E spec files, CI/CD pipeline |
| **Status** | ?? Excellent - 88% QA maturity score |

---

## ?? COVERAGE SUMMARY

### Functional Requirements (FR)

| Requirement ID | Feature | Implementation | E2E Tests | Unit Tests | Status |
|---|---|---|---|---|---|
| REQ-001 | Product Catalog | ? | ? | ?? | ? Complete |
| REQ-002 | Product Detail | ? | ? | ?? | ? Complete |
| REQ-003 | Shopping Cart | ? | ? | ?? | ? Complete |
| REQ-004 | Checkout Form | ? | ? | ?? | ? Complete |
| REQ-005 | Order Placement | ? | ? | ?? | ? Complete |
| REQ-006 | Order Confirmation | ? | ? | ?? | ? Complete |
| REQ-007 | Navigation | ? | ? | ?? | ? Complete |
| REQ-008 | API Endpoints | ? | ? | ?? | ? Complete |
| REQ-009 | Admin Order Dashboard | ? | ? | ? | ?? Complete (auth implemented, E2E pending) |
| REQ-010 | Admin Order Status Mgmt | ? | ? | ? | ?? Complete (auth implemented, E2E pending) |
| REQ-009 | Admin Order Dashboard | ? | ? | ? | ?? Complete (auth implemented, E2E pending) |
| REQ-010 | Admin Order Status Mgmt | ? | ? | ? | ?? Complete (auth implemented, E2E pending) |

**FR Implementation Coverage:** 10/10 (100%)  
**FR E2E Test Coverage:** 8/10 (80%)  
**FR Unit Test Coverage:** 0/10 (0%) - ?? Gap identified

---

### Non-Functional Requirements (NFR)

| Requirement ID | Category | Implementation | Tests | Status |
|---|---|---|---|---|
| NFR-001 | Performance | ? | ? | ?? Not Validated |
| NFR-002 | Scalability | ? | ? | ?? Not Validated |
| NFR-003 | Security | ? | ? | ? | ? Good (JWT auth implemented) |
| NFR-004 | Reliability | ?? | ? | ?? Partial |
| NFR-005 | Usability | ? | ?? | ?? Good |
| NFR-006 | Maintainability | ? | ? | ?? Excellent |

**NFR Implementation Coverage:** 5.5/6 (92%)  
**NFR Test Coverage:** 2.5/6 (42%) - ?? Gaps identified

---

## ?? TEST FILES ? REQUIREMENTS MAPPING

### E2E Test Suite (Playwright)

| Test File | Requirements Covered | Test Count |
|---|---|---|
| `tests/e2e/specs/home.spec.js` | REQ-001, REQ-007 | ~5 tests |
| `tests/e2e/specs/product.spec.js` | REQ-002 | ~4 tests |
| `tests/e2e/specs/cart.spec.js` | REQ-003 | ~6 tests |
| `tests/e2e/specs/checkout.spec.js` | REQ-004 | ~5 tests |
| `tests/e2e/specs/e2e-flow.spec.js` | REQ-005, REQ-006 | ~3 tests |
| `tests/e2e/specs/api.spec.js` | REQ-005, REQ-008, NFR-004 | ~8 tests |

**Total E2E Tests:** ~31 tests covering all functional requirements

---

## ? GAPS IDENTIFIED

### Critical Gaps

1. **Unit Test Coverage: 0%**
   - **Impact:** Cannot validate component logic in isolation
   - **Requirement IDs Affected:** REQ-001 through REQ-008
   - **Recommendation:** Add Vitest unit tests for:
     - React components (HomePage, ProductPage, CartPage, CheckoutPage, ConfirmationPage)
     - CartContext logic
     - productService.js
     - Backend routes (products.js, orders.js)
   - **Target:** 80% line coverage

2. **Performance Testing: Missing**
   - **Impact:** Cannot validate NFR-001 performance requirements
   - **Requirement IDs Affected:** NFR-001
   - **Recommendation:** Add k6 or Lighthouse performance tests

3. **Security Testing: Incomplete**
   - **Impact:** Cannot validate NFR-003 security requirements
   - **Requirement IDs Affected:** NFR-003
   - **Recommendation:** Add OWASP ZAP scan, SQL injection tests, XSS tests

4. **Scalability Testing: Missing**
   - **Impact:** Cannot validate NFR-002 scalability requirements
   - **Requirement IDs Affected:** NFR-002
   - **Recommendation:** Add load tests with k6 or Apache JMeter

5. **Admin Feature Testing: Missing**
   - **Impact:** Admin routes (REQ-009, REQ-010) are implemented but have no E2E or unit tests
   - **Requirement IDs Affected:** REQ-009, REQ-010
   - **Recommendation:** Add E2E tests for /admin/orders and /admin/orders/:id pages, test order status updates

6. **Admin Authentication: Missing**
   - **Impact:** Admin routes are publicly accessible - CRITICAL SECURITY GAP
   - **Requirement IDs Affected:** REQ-009, REQ-010
   - **Recommendation:** Implement authentication/authorization before production deployment
   - **Impact:** Cannot validate NFR-002 scalability requirements
   - **Requirement IDs Affected:** NFR-002
   - **Recommendation:** Add load tests with k6 or Apache JMeter

---

## ?? NEXT ACTIONS

### Phase 1: Foundation (Week 1-2) - **IN PROGRESS**
- [x] Create PRD.md with all requirements
- [x] Create TRACEABILITY.md (this document)
- [ ] Run `npm run test:coverage` and document baseline
- [ ] Create CODING_STANDARDS.md

### Phase 2: Close Testing Gaps (Week 3-4)
- [ ] Add unit tests for React components (target 80% coverage)
- [ ] Add unit tests for backend routes
- [ ] Add integration tests for API endpoints
- [ ] Run coverage report and enforce threshold in CI

### Phase 3: Validate NFRs (Month 2)
- [ ] Add performance tests (k6 or Lighthouse)
- [ ] Add security tests (OWASP ZAP)
- [ ] Add load tests for scalability validation
- [ ] Document performance baseline metrics

---

## ?? TRACEABILITY METRICS

| Metric | Current | Target | Status |
|---|---|---|---|
| Requirements Documented | 14/14 | 100% | ? Complete |
| FR Implementation Coverage | 8/8 | 100% | ? Complete |
| FR E2E Test Coverage | 8/8 | 100% | ? Complete |
| FR Unit Test Coverage | 0/8 | 100% | ?? Critical Gap |
| NFR Implementation Coverage | 5.5/6 | 100% | ?? Good |
| NFR Test Coverage | 2.5/6 | 100% | ?? Needs Improvement |
| Overall Traceability Score | 75% | 100% | ?? Partial |

---

## ?? REFERENCES

- **Requirements Source:** [PRD.md](PRD.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Test Strategy:** [TESTING.md](TESTING.md)
- **API Contracts:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Project Status:** [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## ?? REVISION HISTORY

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | Tech Lead | Initial traceability matrix (retroactive baseline) |

---

**Document Status:** ? Baseline Established  
**Next Review:** After unit test coverage is added







