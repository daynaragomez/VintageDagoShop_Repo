# Architecture - VintageDagoShop

VintageDagoShop follows **Clean Architecture** to keep business logic decoupled from frameworks, UI, and storage.

## Core Principles

1. **Framework independence** — business logic does not depend on React or Express.
2. **UI independence** — services and entities have no knowledge of components.
3. **Database independence** — swapping LocalStorage for MySQL only touches the Infrastructure layer.
4. **Testability** — all business logic is testable without UI, DB, or external APIs.

## Layer Diagram

```
┌─────────────────────────────────────────┐
│     PRESENTATION LAYER (UI)             │
│  - Components (React)                   │
│  - Pages                                │
│  - Hooks                                │
└────────────────┬────────────────────────┘
                 ↓ ↑
┌─────────────────────────────────────────┐
│    APPLICATION LAYER (Use Cases)        │
│  - Services                             │
│  - Use Cases                            │
│  - Validators                           │
└────────────────┬────────────────────────┘
                 ↓ ↑
┌─────────────────────────────────────────┐
│      DOMAIN LAYER (Business Rules)      │
│  - Entities                             │
│  - Repository Interfaces                │
└────────────────┬────────────────────────┘
                 ↓ ↑
┌─────────────────────────────────────────┐
│   INFRASTRUCTURE LAYER (External)       │
│  - HTTP API Client (fetch/axios)        │
│  - Repository Implementations           │
│  - Storage (LocalStorage / MySQL)       │
└─────────────────────────────────────────┘
                 ↓ ↑
┌─────────────────────────────────────────┐
│   BACKEND LAYER (Node.js + Express)     │
│  - REST API Routes                      │
│  - Controllers                          │
│  - MySQL Pool (mysql2)                  │
└─────────────────────────────────────────┘
                 ↓ ↑
┌─────────────────────────────────────────┐
│   DATABASE LAYER (Docker)               │
│  - MySQL 8.0                            │
│  - phpMyAdmin (admin UI)                │
│  - Persistent Docker Volume             │
└─────────────────────────────────────────┘
```

## Data Flow

```
User interaction -> Component -> Hook -> Service -> Use Case -> Repository -> MySQL (Docker)
                                                                           <- response
```

## Practical Example: Add to Cart

```javascript
// ProductCard.jsx
function ProductCard({ product }) {
  const { addToCart } = useCart();
  return <button onClick={() => addToCart(product)}>Add to Cart</button>;
}

// useCart.js
export function useCart() {
  const { dispatch } = useContext(CartContext);
  const addToCart = (product) => {
    const result = AddToCartUseCase.execute(product);
    dispatch({ type: 'ADD_ITEM', payload: result });
  };
  return { addToCart };
}
```

### 3. Use Case (Application Layer)

```javascript
export class AddToCartUseCase {
  static execute(product) {
    if (!InventoryService.hasStock(product)) throw new Error('Out of stock');
    const cartItem = CartService.createCartItem(product);
    CartRepository.save(cartItem);
    InventoryService.decreaseStock(product.id, 1);
    return cartItem;
  }
}
```

### 4. Repository (Infrastructure Layer)

```javascript
export class CartRepository {
  static save(cartItem) {
    const cart = LocalStorage.get('cart') || [];
    cart.push(cartItem);
    LocalStorage.set('cart', cart);
    return cartItem;
  }
}
```

## Design Patterns

### 1. Repository Pattern
Abstrae el acceso a datos.

```javascript
// Domain Layer - Interface
export class IProductRepository {
  findAll() { throw new Error('Not implemented'); }
  findById(id) { throw new Error('Not implemented'); }
}

// Infrastructure Layer - Implementation
export class ProductRepository extends IProductRepository {
  static findAll() {
    return LocalStorage.get('products') || INITIAL_PRODUCTS;
  }
  
  static findById(id) {
    const products = this.findAll();
    return products.find(p => p.id === id);
  }
}
```

### 2. Service Layer Pattern

```javascript
export class CartService {
  static createCartItem(product, quantity = 1) {
    return new CartItem({
      id: generateId(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      subtotal: product.price * quantity
    });
  }
  static calculateTotal(cartItems) {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
```

### 3. Use Case Pattern

One use case = one user action.

```javascript
export class ProcessOrderUseCase {
  static async execute(cart, customer) {
    CheckoutValidator.validate(customer);
    const total = CartService.calculateTotal(cart);
    const order = new Order({ customer, items: cart, total, date: new Date() });
    await OrderRepository.save(order);
    await CartRepository.clear();
    return order;
  }
}
```

## Benefits

- Isolated changes: modify UI without touching business logic.
- Application and Domain layers are 100% reusable for React Native.
- Technology (storage, framework) can be swapped without rewriting the core.

## Dependency Rule

```
Presentation -> Application -> Domain <- Infrastructure
```

Domain has no outbound dependencies. All other layers depend inward toward Domain.

```javascript
// Not allowed
import { LocalStorage } from '../../infrastructure/storage';

// Allowed
import { Product } from '@entities/Product';
import { CartService } from '@services/CartService';
```

## Tests by Layer

```javascript
// Presentation
test('ProductCard renders product name', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Vintage Jacket')).toBeInTheDocument();
});

// Application
test('CartService calculates total correctly', () => {
  const items = [{ subtotal: 50 }, { subtotal: 100 }];
  expect(CartService.calculateTotal(items)).toBe(150);
});

// Infrastructure - Phase 1
test('CartRepository saves to localStorage', () => {
  CartRepository.save({ id: '1', name: 'Test' });
  expect(localStorage.getItem('cart')).toBeDefined();
});

// Infrastructure - Phase 2
test('ProductRepository fetches from MySQL', async () => {
  const products = await new ProductRepository().findAll();
  expect(Array.isArray(products)).toBe(true);
  expect(products[0]).toHaveProperty('id');
});
```

## Project Evolution

### Phase 1 — LocalStorage (current)
```
Component -> Hook -> Service -> Repository -> LocalStorage
```

### Phase 2 — MySQL + Docker + Backend API (in progress)
```
React :5173 -> fetch /api/* -> Express :3000 -> mysql2 -> MySQL :3306
```

Only the Infrastructure repositories change. Application, Domain, and Presentation stay the same.

```javascript
// Phase 1
export class ProductRepository {
  findAll() {
    return JSON.parse(localStorage.getItem('products') || '[]');
  }
}

// Phase 2 — same interface, new implementation
export class ProductRepository {
  async findAll() {
    const res = await fetch('/api/products');
    const { data } = await res.json();
    return data;
  }
}
```

### Phase 3 — Advanced features
```
React Native <-> Express API <-> MySQL (Docker / Cloud RDS)
                     |
              JWT Auth, Stripe, Redis
```

## Component Dependency Graph

```
App.jsx
  +-- HomePage
  |     +-- ProductGrid -> ProductCard -> useCart -> CartService -> CartRepository
  |     +-- CartModal -> useCart -> CartService
  +-- CheckoutPage -> CheckoutForm -> useCheckout -> ProcessOrderUseCase
  +-- CartContext -> CartService, InventoryService, CartRepository
```

## References

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

See also: [DATABASE.md](./DATABASE.md) | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
