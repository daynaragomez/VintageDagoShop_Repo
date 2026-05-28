# Coding Standards
## VintageDagoShop

> **Purpose:** Ensure code consistency, readability, and maintainability  
> **Last Updated:** 2026-05-27  
> **Status:** Living Document

---

## 📋 TABLE OF CONTENTS

1. [General Principles](#general-principles)
2. [File Naming Conventions](#file-naming-conventions)
3. [Code Formatting](#code-formatting)
4. [React Component Patterns](#react-component-patterns)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Backend Code](#backend-code)
8. [Database Conventions](#database-conventions)
9. [Test Code](#test-code)
10. [Comments & Documentation](#comments--documentation)
11. [Error Handling](#error-handling)
12. [Git Commit Messages](#git-commit-messages)

---

## 🎯 GENERAL PRINCIPLES

### 1. **Keep It Simple**
- Prefer simple, readable code over clever abstractions
- Optimize for clarity, not brevity
- Write code that junior developers can understand

### 2. **DRY (Don't Repeat Yourself)**
- Extract repeated logic into functions/components
- Use shared utilities for common operations
- But: Don't over-abstract for 2 uses - wait for 3+

### 3. **Separation of Concerns**
- UI logic in presentation layer
- Business logic separate from UI
- API calls in infrastructure/api services
- Database access only in backend routes

### 4. **Consistent Naming**
- Use descriptive names that reveal intent
- Avoid abbreviations unless universally known (e.g., `id`, `url`)
- Name things based on what they DO, not how they work

---

## 📁 FILE NAMING CONVENTIONS

### Frontend Files

| File Type | Convention | Example |
|---|---|---|
| React Components | **PascalCase**.jsx | `HomePage.jsx`, `CartContext.jsx` |
| Component CSS | Match component name | `HomePage.css`, `Navbar.css` |
| Utility Functions | **camelCase**.js | `formatPrice.js`, `validateEmail.js` |
| API Services | **camelCase**Service.js | `productService.js`, `orderService.js` |
| Constants | **UPPER_SNAKE_CASE**.js | `API_CONSTANTS.js` |
| Test Files | **kebab-case**.test.jsx | `home-page.test.jsx`, `cart-context.test.jsx` |

### Backend Files

| File Type | Convention | Example |
|---|---|---|
| Route Handlers | **camelCase**.js | `products.js`, `orders.js` |
| Middleware | **camelCase**.js | `auth.js`, `errorHandler.js` |
| Utility Functions | **camelCase**.js | `validateOrder.js` |
| Configuration | **camelCase**.js | `connection.js` |

### Test Files (E2E)

| File Type | Convention | Example |
|---|---|---|
| Spec Files | **kebab-case**.spec.js | `home.spec.js`, `e2e-flow.spec.js` |
| Page Objects | **PascalCase**.js | `HomePage.js`, `CartPage.js` |
| Steps | **PascalCase**Steps.js | `HomeSteps.js`, `CartSteps.js` |
| Assertions | **PascalCase**Assertions.js | `HomeAssertions.js`, `CartAssertions.js` |

### Directory Names

- **Frontend:** kebab-case or camelCase (existing: `presentation`, `infrastructure`)
- **Backend:** camelCase (existing: `routes`, `db`)
- **Tests:** kebab-case (existing: `e2e`, `unit`, `integration`)

---

## 🎨 CODE FORMATTING

### Tool Configuration
- **Prettier:** Auto-formatting (see `.prettierrc.json`)
- **ESLint:** Linting rules (see `.eslintrc.json`)
- **Run before commit:** `npm run format` and `npm run lint`

### Key Rules
- **Indentation:** 2 spaces (no tabs)
- **Quotes:** Single quotes for JS, double quotes for JSX attributes
- **Semicolons:** Required at end of statements
- **Line Length:** 120 characters max (Prettier default)
- **Trailing Commas:** Yes (easier diffs)

### Example

```javascript
// ✅ Good
const products = [
  { id: 1, name: 'Jacket' },
  { id: 2, name: 'Jeans' }, // trailing comma
];

function fetchProducts() {
  return fetch('/api/products');
}

// ❌ Bad
const products=[{id:1,name:"Jacket"},{id:2,name:"Jeans"}] // no spaces, double quotes, no semicolon
```

---

## ⚛️ REACT COMPONENT PATTERNS

### Component Structure

**Always use functional components with hooks** (no class components)

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
	// Side effects
  }, [dependencies]);

  // 2. Event handlers (prefix with 'handle')
  function handleClick() {
	// Logic
  }

  // 3. Helper functions
  function calculateTotal() {
	// Logic
  }

  // 4. Render
  return (
	<div className="component-name" data-testid="component-name">
	  {/* JSX */}
	</div>
  );
};

export default ComponentName;
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component | PascalCase | `HomePage`, `ProductCard` |
| Props | camelCase | `productId`, `onAddToCart` |
| State Variables | camelCase | `cartItems`, `isLoading` |
| Event Handlers | handle + EventName | `handleClick`, `handleSubmit` |
| Boolean State | is/has prefix | `isLoading`, `hasError` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUANTITY`, `API_URL` |

### Props Destructuring

**Always destructure props** at function signature

```javascript
// ✅ Good
const ProductCard = ({ product, onAddToCart }) => {
  return <button onClick={() => onAddToCart(product)}>Add</button>;
};

// ❌ Bad
const ProductCard = (props) => {
  return <button onClick={() => props.onAddToCart(props.product)}>Add</button>;
};
```

### Conditional Rendering

```javascript
// ✅ Good - Clean ternary for simple conditions
{loading ? <p>Loading...</p> : <ProductList products={products} />}

// ✅ Good - && for single branch
{error && <p className="error">{error}</p>}

// ✅ Good - Early return for complex conditions
if (loading) return <p>Loading...</p>;
if (error) return <p>{error}</p>;
return <ProductList products={products} />;

// ❌ Bad - Nested ternaries (hard to read)
{loading ? <Spinner /> : error ? <Error /> : products.length ? <List /> : <Empty />}
```

### Data-TestID Attributes

**Always add data-testid for E2E testable elements**

```javascript
// ✅ Good
<button data-testid="add-to-cart-btn" onClick={handleAddToCart}>
  Add to Cart
</button>

<input data-testid="search-input" placeholder="Search..." />

// Convention: kebab-case, descriptive, unique per page
```

---

## 🔄 STATE MANAGEMENT

### Local State (useState)

Use for component-specific state

```javascript
const [quantity, setQuantity] = useState(1);
const [isOpen, setIsOpen] = useState(false);
```

### Context API (React Context)

Use for **global state** that many components need

**Current Usage:**
- `CartContext` - cart items, cart operations (add/remove/update)

**When to Use Context:**
- State needed by 3+ unrelated components
- Avoid prop drilling more than 2 levels
- Application-wide settings (theme, auth, cart)

**Pattern:**

```javascript
// 1. Create Context
const MyContext = createContext();

// 2. Create Provider Component
export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const actions = {
	doSomething: () => { /* logic */ },
  };

  return (
	<MyContext.Provider value={{ state, ...actions }}>
	  {children}
	</MyContext.Provider>
  );
};

// 3. Create Custom Hook
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
	throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

### State Persistence

**Use localStorage for client-side persistence**

```javascript
// Save to localStorage whenever state changes
useEffect(() => {
  localStorage.setItem('key', JSON.stringify(state));
}, [state]);

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('key');
  if (saved) {
	setState(JSON.parse(saved));
  }
}, []);
```

---

## 🌐 API INTEGRATION

### API Service Pattern

**All API calls go through service files** in `infrastructure/api/`

**Pattern:**

```javascript
// src/infrastructure/api/entityService.js
const BASE_URL = '/api';

export async function fetchEntities() {
  const res = await fetch(`${BASE_URL}/entities`);
  if (!res.ok) throw new Error('Failed to fetch entities');
  return res.json();
}

export async function fetchEntity(id) {
  const res = await fetch(`${BASE_URL}/entities/${id}`);
  if (!res.ok) throw new Error('Entity not found');
  return res.json();
}

export async function createEntity(data) {
  const res = await fetch(`${BASE_URL}/entities`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create entity');
  return json;
}
```

### Using Services in Components

```javascript
import { fetchProducts } from '../../../infrastructure/api/productService';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
	fetchProducts()
	  .then(setProducts)
	  .catch(() => setError('Could not load products'))
	  .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return <ProductGrid products={products} />;
};
```

### Error Handling Pattern

**Always handle API errors gracefully**

```javascript
// ✅ Good - User-friendly error messages
.catch(() => setError('Could not load products. Make sure the backend is running.'))

// ❌ Bad - Raw error objects or technical jargon
.catch(err => setError(err.toString()))
```

---

## 🖥️ BACKEND CODE

### Route Handler Pattern

```javascript
// backend/src/routes/resource.js
const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET collection
router.get('/', async (req, res) => {
  try {
	const [rows] = await pool.query('SELECT * FROM resources');
	res.json(rows);
  } catch (err) {
	res.status(500).json({ error: err.message });
  }
});

// GET single resource
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
	const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
	if (rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
	res.json(rows[0]);
  } catch (err) {
	res.status(500).json({ error: err.message });
  }
});

// POST create resource
router.post('/', async (req, res) => {
  const { field1, field2 } = req.body;

  // Validate required fields
  if (!field1 || !field2) {
	return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
	const [result] = await pool.query(
	  'INSERT INTO resources (field1, field2) VALUES (?, ?)',
	  [field1, field2]
	);
	res.status(201).json({ id: result.insertId, field1, field2 });
  } catch (err) {
	res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### Error Response Format

**Always return JSON errors with `error` key**

```javascript
// ✅ Good
res.status(404).json({ error: 'Product not found' });
res.status(400).json({ error: 'Missing required fields' });

// ❌ Bad
res.status(404).send('Not found'); // plain text
res.status(400).json({ message: 'Bad request' }); // inconsistent key
```

### SQL Query Safety

**Always use parameterized queries** (prevents SQL injection)

```javascript
// ✅ Good - Parameterized query
pool.query('SELECT * FROM products WHERE id = ?', [id]);

// ❌ Bad - String interpolation (SQL injection risk!)
pool.query(`SELECT * FROM products WHERE id = ${id}`);
```

### Transaction Pattern

**Use transactions for multi-step operations**

```javascript
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();

  // Step 1
  const [result1] = await conn.query('INSERT INTO table1 ...');

  // Step 2
  await conn.query('UPDATE table2 WHERE id = ?', [result1.insertId]);

  await conn.commit();
  res.status(201).json({ success: true });
} catch (err) {
  await conn.rollback();
  res.status(400).json({ error: err.message });
} finally {
  conn.release();
}
```

---

## 🗄️ DATABASE CONVENTIONS

### Table Names
- **Plural, lowercase** (e.g., `products`, `orders`, `order_items`)
- Use **snake_case** for multi-word tables (e.g., `order_items`)

### Column Names
- **Singular, snake_case** (e.g., `product_id`, `created_at`)
- Primary keys: `id` (auto-increment INT)
- Foreign keys: `{table}_id` (e.g., `customer_id`, `product_id`)
- Timestamps: `created_at`, `updated_at`

### Enum Values
- **lowercase** (e.g., `'pending'`, `'confirmed'`, `'shipped'`)

### Example Schema

```sql
CREATE TABLE orders (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status     ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
  total      DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

---

## 🧪 TEST CODE

### E2E Test Structure (Playwright)

**Follow Page Object Model pattern**

```javascript
// tests/e2e/specs/feature.spec.js
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something @smoke @ui', async ({ page, homePage, homeSteps, homeAssertions }) => {
	// 1. Setup (using steps)
	await homeSteps.navigateToHome();

	// 2. Action (using steps or page objects)
	await homeSteps.clickProduct(0);

	// 3. Assert (using assertions)
	await homeAssertions.productDetailVisible();
  });
});
```

### Test Naming

```javascript
// ✅ Good - Descriptive, action-oriented
test('should add product to cart when Add to Cart button clicked', ...);
test('should display error message for invalid email', ...);

// ❌ Bad - Vague or implementation-focused
test('test cart', ...);
test('check if useState works', ...);
```

### Test Tags

**Use tags for test categorization**

| Tag | Purpose |
|---|---|
| `@smoke` | Fast, critical-path tests (run on every commit) |
| `@ui` | Browser UI interaction tests |
| `@api` | Backend API contract tests |
| `@e2e` | Full user journey tests |
| `@critical` | Business-critical flows (order placement, payment) |
| `@validation` | Form validation tests |

**Format:** `@tagname` at end of test description

```javascript
test('should complete purchase flow @e2e @critical @smoke', async ({ ... }) => {
  // Test
});
```

### Data-TestID Pattern

**Use descriptive, kebab-case IDs**

```javascript
// Page Object
this.searchInput = page.getByTestId('search-input');
this.addToCartBtn = page.getByTestId('add-to-cart-btn');

// Assertion
await expect(page.getByTestId('product-detail-name')).toContainText('Jacket');
```

### No Raw Assertions in Specs

**All `expect()` calls go in Assertions classes**

```javascript
// ✅ Good - Centralized assertions
// specs/home.spec.js
await homeAssertions.productCountEquals(3);

// assertions/HomeAssertions.js
async productCountEquals(count) {
  await expect(this.page.getByTestId('product-card')).toHaveCount(count);
}

// ❌ Bad - Raw expect in spec
test('...', async ({ page }) => {
  await expect(page.getByTestId('product-card')).toHaveCount(3);
});
```

---

## 💬 COMMENTS & DOCUMENTATION

### When to Comment

**DO comment:**
- Complex business logic
- Non-obvious workarounds
- "Why" something is done a certain way

**DON'T comment:**
- Obvious code (let code be self-documenting)
- What the code does (name things better instead)

```javascript
// ✅ Good - Explains WHY
// Tax rate is fixed at 15% per business requirement (no regional calculation in MVP)
const TAX_RATE = 0.15;

// ❌ Bad - Explains WHAT (obvious from code)
// Loop through products
products.forEach(product => { ... });

// ✅ Good - Self-documenting (no comment needed)
const calculateTotalWithTax = (subtotal) => subtotal * (1 + TAX_RATE);
```

### JSDoc for Functions

**Use JSDoc for exported utility functions**

```javascript
/**
 * Formats a number as USD currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$89.99")
 */
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
```

### TODO Comments

**Format:** `// TODO: Description (initials, date)`

```javascript
// TODO: Add pagination when product count > 100 (JD, 2026-05-27)
```

---

## ⚠️ ERROR HANDLING

### Frontend Error States

**Always provide user-friendly error messages**

```javascript
// ✅ Good
const [error, setError] = useState(null);

fetchProducts()
  .catch(() => setError('Could not load products. Please check your connection.'));

if (error) return <p className="error-message">{error}</p>;

// ❌ Bad
.catch(err => console.error(err)); // Silent failure
.catch(err => alert(err.stack)); // Technical error exposed
```

### Backend Error Handling

**Return appropriate HTTP status codes**

| Status | Use Case |
|---|---|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 500 | Server error |

```javascript
// ✅ Good - Specific status codes
if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });
if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

// ❌ Bad - Generic 500 for everything
res.status(500).json({ error: 'Something went wrong' });
```

---

## 📝 GIT COMMIT MESSAGES

### Format

```
<type>(<scope>): <subject>

<optional body>
```

### Types

| Type | Use Case |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code restructure (no feature/bug change) |
| `test` | Add or update tests |
| `chore` | Build, deps, config changes |

### Examples

```bash
# ✅ Good
feat(cart): add quantity increment/decrement buttons
fix(checkout): validate email format before submission
docs(readme): update setup instructions for Docker
test(e2e): add smoke tests for homepage

# ❌ Bad
update stuff
fixed bug
WIP
asdfasdf
```

### Commit Size

- **Small, atomic commits** (one logical change per commit)
- **Commit often** (every completed micro-task)
- **Don't commit broken code** (tests should pass)

---

## 🔍 CODE REVIEW CHECKLIST

Before submitting code for review:

- [ ] Code follows naming conventions
- [ ] No console.log statements (use proper logging)
- [ ] All functions have clear, descriptive names
- [ ] Complex logic has comments explaining WHY
- [ ] Tests added/updated for new features
- [ ] No hardcoded values (use constants or environment variables)
- [ ] Error handling for all API calls
- [ ] Data-testid added for new UI elements
- [ ] Ran `npm run lint` and `npm run format` (no errors)
- [ ] Tested locally (all features work)

---

## 📚 REFERENCES

- **Prettier Config:** `.prettierrc.json`
- **ESLint Config:** `.eslintrc.json`
- **Project Structure:** `docs/PROJECT_STRUCTURE.md`
- **Architecture:** `docs/ARCHITECTURE.md`
- **Testing Strategy:** `docs/TESTING.md`

---

**Document Owner:** Tech Lead  
**Review Frequency:** Quarterly or when patterns change  
**Last Review:** 2026-05-27
