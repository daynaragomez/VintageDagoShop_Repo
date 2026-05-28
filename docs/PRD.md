# Product Requirements Document (PRD)
## VintageDagoShop - E-Commerce Platform

> **Version:** 1.0  
> **Date:** 2026-05-27  
> **Status:** Retroactive Documentation  
> **Owner:** Product Manager

---

## ?? EXECUTIVE SUMMARY

**Product Name:** VintageDagoShop  
**Product Type:** Full-stack e-commerce web application  
**Target Market:** Vintage clothing enthusiasts and collectors  
**Business Model:** Direct-to-consumer online retail

**Vision Statement:**  
Create a seamless online shopping experience for vintage clothing enthusiasts, providing a curated catalog with real-time inventory management and a frictionless checkout process.

---

## ?? BUSINESS OBJECTIVES

### Primary Objectives
1. **Revenue Generation:** Enable online sales of vintage clothing items
2. **Customer Acquisition:** Attract vintage fashion enthusiasts through clean UX
3. **Inventory Control:** Prevent overselling through real-time stock management
4. **Order Fulfillment:** Capture complete customer and shipping information

### Success Metrics
| Metric | Target | Measurement |
|---|---|---|
| Conversion Rate | 2-5% | Orders / Unique Visitors |
| Cart Abandonment Rate | <70% | Incomplete Checkouts / Cart Additions |
| Average Order Value | $50+ | Total Revenue / Orders |
| Stock Accuracy | 100% | No overselling incidents |
| Page Load Time | <2s | 95th percentile response time |

---

## ?? USER PERSONAS

### Persona 1: "Vintage Vera"
- **Age:** 28-35
- **Occupation:** Creative professional (designer, artist)
- **Tech Savvy:** High
- **Shopping Behavior:** Researches products, reads descriptions carefully
- **Pain Points:** Wants authentic vintage pieces, frustrated by out-of-stock surprises
- **Goals:** Find unique clothing items, know exact product details before buying

### Persona 2: "Casual Chris"
- **Age:** 22-30
- **Occupation:** Student or entry-level professional
- **Tech Savvy:** Medium
- **Shopping Behavior:** Browses casually, impulse buyer
- **Pain Points:** Complex checkout processes, wants quick purchase flow
- **Goals:** Easy browsing, simple checkout, mobile-friendly

---

## ??? FUNCTIONAL REQUIREMENTS

### FR-1: Product Catalog Display

**User Story:** As a **customer**, I want to **browse all available vintage items in a grid layout**, so that **I can quickly scan the inventory and find items I like**.

**Acceptance Criteria:**
- ? AC-1.1: Homepage displays all products in a responsive grid (3-4 columns desktop, 1-2 mobile)
- ? AC-1.2: Each product card shows: image, name, price, category
- ? AC-1.3: Products load from backend API (GET /api/products)
- ? AC-1.4: Page renders within 2 seconds on average connection
- ? AC-1.5: Grid is responsive and adapts to screen size

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-001

---

### FR-2: Product Detail View

**User Story:** As a **customer**, I want to **view detailed information about a specific product**, so that **I can make an informed purchase decision**.

**Acceptance Criteria:**
- ? AC-2.1: Clicking a product card navigates to /product/:id route
- ? AC-2.2: Detail page displays: large image, name, price, full description, detailed specifications
- ? AC-2.3: Current stock level is visible
- ? AC-2.4: "Add to Cart" button is prominent and functional
- ? AC-2.5: Data fetched from GET /api/products/:id
- ? AC-2.6: 404 error handling if product not found

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-002

---

### FR-3: Shopping Cart Management

**User Story:** As a **customer**, I want to **add items to a cart and adjust quantities**, so that **I can collect multiple items before checking out**.

**Acceptance Criteria:**
- ? AC-3.1: Cart state persists across page navigation (React Context)
- ? AC-3.2: Cart data persists in localStorage (survives page refresh)
- ? AC-3.3: Navbar displays cart item count badge
- ? AC-3.4: Cart page (/cart) shows all items with: image, name, price, quantity
- ? AC-3.5: Quantity can be adjusted with +/- buttons
- ? AC-3.6: Items can be removed from cart
- ? AC-3.7: Subtotal and tax (15%) calculated automatically
- ? AC-3.8: "Proceed to Checkout" button navigates to checkout page

**Business Rule:** Tax rate is fixed at 15%

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-003

---

### FR-4: Checkout Form

**User Story:** As a **customer**, I want to **provide my contact and shipping information in a form**, so that **the shop can deliver my order**.

**Acceptance Criteria:**
- ? AC-4.1: Form collects: name, email, phone (optional), street, city, state (optional), zip code (optional), country
- ? AC-4.2: Required fields are validated (name, email, street, city, country)
- ? AC-4.3: Email format is validated
- ? AC-4.4: Clear error messages display for invalid inputs
- ? AC-4.5: Order summary displays: items, quantities, subtotal, tax, total
- ? AC-4.6: "Place Order" button is disabled during submission
- ? AC-4.7: Submits POST /api/orders with customer, address, and items

**Validation Rules:**
- Name: Required, non-empty
- Email: Required, valid email format
- Phone: Optional, accepts various formats
- Street: Required, non-empty
- City: Required, non-empty
- State: Optional
- Zip Code: Optional
- Country: Required, non-empty

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-004

---

### FR-5: Order Placement & Stock Decrement

**User Story:** As a **shop owner**, I want to **ensure stock is decremented atomically when an order is placed**, so that **I never oversell inventory**.

**Acceptance Criteria:**
- ? AC-5.1: Order submission creates customer record if new
- ? AC-5.2: Order submission creates address record linked to customer
- ? AC-5.3: Order submission creates order record with subtotal, tax, total
- ? AC-5.4: Order submission creates order_items records for each product
- ? AC-5.5: Stock is decremented for each product in a database transaction
- ? AC-5.6: Transaction uses row-level locks (FOR UPDATE) to prevent race conditions
- ? AC-5.7: If stock is insufficient, transaction rolls back and returns 400 error
- ? AC-5.8: On success, returns orderId, subtotal, tax, total

**Business Rules:**
- Stock cannot go negative
- All operations (customer, address, order, order_items, stock decrement) are atomic
- Concurrent orders are serialized per product

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-005

---

### FR-6: Order Confirmation

**User Story:** As a **customer**, I want to **see a confirmation page after placing an order**, so that **I know my order was successful**.

**Acceptance Criteria:**
- ? AC-6.1: After successful order placement, redirect to /confirmation
- ? AC-6.2: Confirmation page displays: order ID, total amount, success message
- ? AC-6.3: Order details are passed via React Router state
- ? AC-6.4: Cart is cleared after successful order
- ? AC-6.5: "Continue Shopping" link returns to homepage

**Priority:** P1 (Should Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-006

---

### FR-7: Navigation

**User Story:** As a **customer**, I want to **easily navigate between pages**, so that **I can access cart and return to catalog**.

**Acceptance Criteria:**
- ? AC-7.1: Persistent navbar on all pages
- ? AC-7.2: Navbar displays: brand logo/name, cart icon with item count badge
- ? AC-7.3: Logo/name links to homepage
- ? AC-7.4: Cart icon links to /cart
- ? AC-7.5: Navbar is responsive (mobile-friendly)

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-007

---

### FR-8: API Endpoints

**User Story:** As a **frontend developer**, I want to **consume RESTful API endpoints**, so that **I can build a decoupled frontend**.

**Acceptance Criteria:**
- ? AC-8.1: GET /api/products returns array of all products with stock
- ? AC-8.2: GET /api/products/:id returns single product or 404
- ? AC-8.3: POST /api/orders accepts order payload and returns order summary
- ? AC-8.4: API returns proper HTTP status codes (200, 201, 400, 404, 500)
- ? AC-8.5: Error responses include { "error": "message" } format
- ? AC-8.6: API runs on port 3000, CORS enabled for frontend

**Priority:** P0 (Must Have)  
**Implementation Status:** ? Complete  
**Requirement ID:** REQ-008

---

### FR-9: Admin Order Dashboard

**User Story:** As an **admin**, I want to **view all customer orders in a table**, so that **I can manage and fulfill orders**.

**Acceptance Criteria:**
- ? AC-9.1: /admin/orders displays all orders in a table
- ? AC-9.2: Table shows: order ID, customer name, total, status, date
- ? AC-9.3: Orders are sorted by created_at DESC (newest first)
- ? AC-9.4: Each row links to /admin/orders/:id for detail view
- ? AC-9.5: Data fetched from GET /api/orders

**Security Note:** ???? **CRITICAL GAP** - Admin routes are currently UNPROTECTED. No authentication/authorization is implemented.

**Priority:** P1 (Should Have)  
**Implementation Status:** ? Complete (but insecure)  
**Requirement ID:** REQ-009

---

### FR-10: Admin Order Status Management

**User Story:** As an **admin**, I want to **view order details and update order status**, so that **I can track fulfillment workflow**.

**Acceptance Criteria:**
- ? AC-10.1: /admin/orders/:id displays full order detail
- ? AC-10.2: Shows customer info, shipping address, line items, totals
- ? AC-10.3: Status can be updated via dropdown (pending ? confirmed ? shipped ? delivered)
- ? AC-10.4: Status update sends PATCH /api/orders/:id/status
- ? AC-10.5: Success message displays on status change
- ? AC-10.6: Error handling for failed updates

**Security Note:** ???? **CRITICAL GAP** - Admin routes are currently UNPROTECTED. No authentication/authorization is implemented.

**Priority:** P1 (Should Have)  
**Implementation Status:** ? Complete (but insecure)  
**Requirement ID:** REQ-010

---
## ?? NON-FUNCTIONAL REQUIREMENTS

### NFR-1: Performance
- **Requirement:** Frontend page load time < 2 seconds (95th percentile)
- **Requirement:** API response time < 500ms for product list
- **Requirement:** API response time < 300ms for order placement
- **Status:** ?? Not measured - No performance tests exist
- **Requirement ID:** NFR-001

### NFR-2: Scalability
- **Requirement:** Support 100 concurrent users without degradation
- **Requirement:** Database can handle 1,000+ products
- **Status:** ?? Not validated - No load testing performed
- **Requirement ID:** NFR-002

### NFR-3: Security
- **Requirement:** Input validation on all form fields
- **Requirement:** SQL injection prevention (parameterized queries)
- **Requirement:** XSS prevention (React auto-escaping)
- **Status:** ?? Partial - No explicit security testing
- **Requirement ID:** NFR-003

### NFR-4: Reliability
- **Requirement:** 99.9% uptime for production environment
- **Requirement:** Automated database backups
- **Requirement:** Transaction rollback on failure
- **Status:** ?? Partial - Transactions implemented, backups not configured
- **Requirement ID:** NFR-004

### NFR-5: Usability
- **Requirement:** Mobile-responsive design (works on phones, tablets, desktop)
- **Requirement:** Accessible to keyboard navigation
- **Requirement:** Clear error messages for user actions
- **Status:** ?? Good - Responsive design implemented, accessibility not tested
- **Requirement ID:** NFR-005

### NFR-6: Maintainability
- **Requirement:** Automated E2E and unit tests
- **Requirement:** Clean code architecture with separation of concerns
- **Requirement:** Comprehensive documentation
- **Status:** ?? Excellent - 88% QA maturity score
- **Requirement ID:** NFR-006

---

## ?? CONSTRAINTS

### Technical Constraints
- **Frontend:** Must use React 18 with React Router v6
- **Backend:** Node.js with Express framework
- **Database:** MySQL 8.0 (Docker containerized for development)
- **Deployment:** Docker Compose for local dev (production strategy TBD)

### Business Constraints
- **Initial Catalog:** Limited to 3 seed products (Jacket, Jeans, T-Shirt)
- **Payment:** Payment processing is **out of scope** for MVP (checkout captures info only)
- **Inventory:** No admin panel for inventory management (manual DB updates)
- **User Accounts:** No user authentication or order history (guest checkout only)

---

## ?? OUT OF SCOPE (Future Phases)

The following features are **explicitly excluded** from the current MVP:

### Phase 2 (Future)
- ? User authentication and accounts
- ? Order history / "My Orders" page
- ? Payment processing integration (Stripe, PayPal)
- ? Product search and filtering
- ? Product reviews and ratings
- ? Wishlist / Favorites

### Phase 3 (Future)
- ? Admin panel for product management
- ? Order status tracking
- ? Email notifications (order confirmation, shipping updates)
- ? Inventory alerts for low stock
- ? Analytics dashboard

### Phase 4 (Future)
- ? Multi-currency support
- ? International shipping calculation
- ? Product recommendations
- ? Social media integration
- ? Promotional codes / discounts

---

## ?? FEATURE PRIORITY MATRIX

| Requirement ID | Feature | Priority | Business Value | Implementation Complexity | Status |
|---|---|---|---|---|---|
| REQ-001 | Product Catalog | P0 | High | Low | ? Complete |
| REQ-002 | Product Detail | P0 | High | Low | ? Complete |
| REQ-003 | Shopping Cart | P0 | Critical | Medium | ? Complete |
| REQ-004 | Checkout Form | P0 | Critical | Medium | ? Complete |
| REQ-005 | Order Placement | P0 | Critical | High | ? Complete |
| REQ-006 | Order Confirmation | P1 | Medium | Low | ? Complete |
| REQ-007 | Navigation | P0 | High | Low | ? Complete |
| REQ-008 | API Endpoints | P0 | High | Medium | ? Complete |
| REQ-009 | Admin Order Dashboard | P1 | High | Medium | ???? Complete (insecure) |
| REQ-010 | Admin Order Status Mgmt | P1 | High | Medium | ???? Complete (insecure) |

**Priority Legend:**
- **P0:** Must Have (blocking launch)
- **P1:** Should Have (important but not blocking)
- **P2:** Nice to Have (can defer)
- **P3:** Future (explicitly out of scope)

---

## ?? ACCEPTANCE TESTING STRATEGY

All functional requirements must pass the following test types:

### E2E Tests (Playwright)
- ? Smoke tests covering critical path (browse ? add to cart ? checkout ? order)
- ? UI tests for each page (home, product, cart, checkout, confirmation)
- ? API contract tests for all endpoints
- ? Form validation tests
- ? Stock boundary tests (prevent overselling)
- ? Concurrent order tests (race condition prevention)

**Current Coverage:** ?? Excellent (6 spec files, tagged test suite)

### Unit/Integration Tests (Vitest)
- ?? Component tests for React pages
- ?? API route tests

**Current Coverage:** ?? Unknown (no coverage report)

---

## ?? ROLLOUT PLAN

### Phase 1: MVP (Current)
**Timeline:** Completed  
**Features:** All P0 requirements (catalog, cart, checkout, order placement)  
**Audience:** Internal testing / staging environment

### Phase 2: Production Soft Launch
**Timeline:** TBD (pending deployment strategy)  
**Prerequisites:**
- Complete deployment documentation (docs/DEPLOYMENT.md)
- Set up production hosting environment
- Configure monitoring and logging
- Implement database backups
- Add security testing

**Audience:** Limited beta users (friends & family)

### Phase 3: Public Launch
**Timeline:** TBD  
**Prerequisites:**
- Successful soft launch with no critical bugs
- Payment processing integration
- Customer support process established
- Marketing materials prepared

**Audience:** General public

---

## ?? DEPENDENCIES

### External Dependencies
- **Docker Desktop:** Required for local MySQL database
- **Node.js 16+:** Required for frontend and backend
- **GitHub Actions:** CI/CD pipeline for automated testing

### Internal Dependencies
- **Database Schema:** Must be initialized with database/init.sql and database/seeds.sql
- **Environment Variables:** .env file must be configured (see .env.example)

---

## ?? ASSUMPTIONS

The following assumptions were made during requirement definition:

1. **Single Currency:** All prices in USD (no multi-currency support)
2. **Single Warehouse:** All products ship from one location (no regional inventory)
3. **Fixed Tax Rate:** 15% tax applies to all orders (no regional tax calculation)
4. **Guest Checkout Only:** No user accounts required (MVP simplification)
5. **Manual Inventory:** Stock levels managed via direct database updates
6. **No Payment Processing:** Checkout captures information only (payment out of scope)
7. **English Only:** No internationalization (i18n) support
8. **Desktop-First Design:** Optimized for desktop, responsive for mobile (not mobile-first)

---

## ?? DEFINITION OF DONE

A feature is considered "Done" when:

1. ? Code implements all acceptance criteria
2. ? E2E tests pass for all user flows
3. ? Unit tests achieve 80%+ coverage (target, not measured yet)
4. ? Code reviewed and approved
5. ? Documentation updated (technical docs, API docs)
6. ? No critical or high-priority bugs
7. ? Deployed to staging environment
8. ? Acceptance tested by product owner

**Current MVP Status:** ? All P0 features meet DoD (except coverage measurement)

---

## ?? REFERENCES

- **Technical Specification:** [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- **API Documentation:** [docs/API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Test Strategy:** [docs/TESTING.md](TESTING.md)
- **Database Schema:** [docs/DATABASE.md](DATABASE.md)
- **Project Status:** [docs/PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## ?? STAKEHOLDERS

| Role | Name | Responsibility |
|---|---|---|
| Product Owner | TBD | Define requirements, prioritize features, acceptance testing |
| Tech Lead | TBD | Architecture decisions, code review, technical feasibility |
| QA Lead | TBD | Test strategy, E2E test framework, quality gates |
| DevOps Engineer | TBD | Deployment, monitoring, infrastructure |

---

## ?? REVISION HISTORY

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-27 | Tech Lead | Initial PRD (retroactive documentation of MVP features) |

---

**Document Status:** ? Approved for Retrospective Use  
**Next Review:** After Phase 2 features are scoped



