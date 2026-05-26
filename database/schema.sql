-- ─────────────────────────────────────────────
-- VintageDagoShop — Database Schema (3NF)
-- ─────────────────────────────────────────────

-- 1. Categories (lookup table — eliminates repeating category strings in products)
CREATE TABLE IF NOT EXISTS categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Products (category_id FK → no transitive dependency on category name)
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  description TEXT,
  details     TEXT,
  category_id INT            NOT NULL,
  image       VARCHAR(500),
  stock       INT            NOT NULL DEFAULT 0,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 3. Customers (extracted from orders — a customer can place many orders)
CREATE TABLE IF NOT EXISTS customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Addresses (separated from orders — structured, queryable, reusable per customer)
CREATE TABLE IF NOT EXISTS addresses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT          NOT NULL,
  street      VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100),
  zip_code    VARCHAR(20),
  country     VARCHAR(100) NOT NULL DEFAULT 'Canada',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 5. Orders (references customer + address — no repeated customer data)
CREATE TABLE IF NOT EXISTS orders (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT           NOT NULL,
  address_id  INT           NOT NULL,
  subtotal    DECIMAL(10, 2) NOT NULL,
  tax         DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total       DECIMAL(10, 2) NOT NULL,
  status      ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
  FOREIGN KEY (address_id)  REFERENCES addresses(id)  ON DELETE RESTRICT
);

-- 6. Order Items (junction table — each row is one product line in an order)
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT            NOT NULL,
  product_id INT            NOT NULL,
  quantity   INT            NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
