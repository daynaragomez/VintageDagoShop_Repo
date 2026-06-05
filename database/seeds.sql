-- ─────────────────────────────────────────────
-- VintageDagoShop — Seed Data
-- Order matters: parent tables before child tables (FK constraints)
-- ─────────────────────────────────────────────

-- 1. Categories
INSERT INTO categories (name, slug) VALUES
  ('Jackets', 'jackets'),
  ('Bottoms', 'bottoms'),
  ('Tops', 'tops'),
  ('Accessories', 'accessories')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

-- 2. Products (aligned with src/shared/data/products.js)
-- Insert product if missing
INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT
  'Vintage Leather Jacket',
  89.99,
  'Classic brown leather jacket from the 80s',
  'Genuine leather, fully lined, two front pockets, silver zipper. A timeless piece from the golden era of rock and roll.',
  c.id,
  'https://via.placeholder.com/600x800/8B4513/FFF?text=Leather+Jacket',
  5
FROM categories c
WHERE c.slug = 'jackets'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Vintage Leather Jacket');

INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT
  'Retro Denim Jeans',
  45.50,
  'High-waisted denim jeans, vintage style',
  'High-rise cut, straight leg, 100% cotton denim. Pre-washed for that authentic worn-in look from the 70s.',
  c.id,
  'https://via.placeholder.com/600x800/4169E1/FFF?text=Denim+Jeans',
  8
FROM categories c
WHERE c.slug = 'bottoms'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Retro Denim Jeans');

INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT
  'Vintage Band T-Shirt',
  29.99,
  'Original 90s rock band t-shirt',
  'Screen-printed graphic tee, pre-shrunk cotton, crew neck. Authentic piece from the 1990s grunge era.',
  c.id,
  'https://via.placeholder.com/600x800/FF6347/FFF?text=Band+T-Shirt',
  12
FROM categories c
WHERE c.slug = 'tops'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Vintage Band T-Shirt');

-- Normalize product data to seed values if records already exist
UPDATE products p
JOIN categories c ON c.slug = 'jackets'
SET
  p.price = 89.99,
  p.description = 'Classic brown leather jacket from the 80s',
  p.details = 'Genuine leather, fully lined, two front pockets, silver zipper. A timeless piece from the golden era of rock and roll.',
  p.image = 'https://via.placeholder.com/600x800/8B4513/FFF?text=Leather+Jacket',
  p.stock = 5,
  p.category_id = c.id
WHERE p.name = 'Vintage Leather Jacket';

UPDATE products p
JOIN categories c ON c.slug = 'bottoms'
SET
  p.price = 45.50,
  p.description = 'High-waisted denim jeans, vintage style',
  p.details = 'High-rise cut, straight leg, 100% cotton denim. Pre-washed for that authentic worn-in look from the 70s.',
  p.image = 'https://via.placeholder.com/600x800/4169E1/FFF?text=Denim+Jeans',
  p.stock = 8,
  p.category_id = c.id
WHERE p.name = 'Retro Denim Jeans';

UPDATE products p
JOIN categories c ON c.slug = 'tops'
SET
  p.price = 29.99,
  p.description = 'Original 90s rock band t-shirt',
  p.details = 'Screen-printed graphic tee, pre-shrunk cotton, crew neck. Authentic piece from the 1990s grunge era.',
  p.image = 'https://via.placeholder.com/600x800/FF6347/FFF?text=Band+T-Shirt',
  p.stock = 12,
  p.category_id = c.id
WHERE p.name = 'Vintage Band T-Shirt';

-- 3. Sample customer
INSERT INTO customers (name, email, phone) VALUES
  ('Jane Doe', 'jane@example.com', '514-555-0100');

-- 4. Sample address (references customer above)
INSERT INTO addresses (customer_id, street, city, state, zip_code, country) VALUES
  (1, '123 Rue Sainte-Catherine', 'Montreal', 'Quebec', 'H3B 1A1', 'Canada');

-- 5. Sample order (references customer + address)
INSERT INTO orders (customer_id, address_id, subtotal, tax, total, status) VALUES
  (1, 1, 89.99, 13.50, 103.49, 'confirmed');

-- 6. Sample order item (references order + product)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 89.99);


-- 7. Admin user for testing (password: admin123)
-- Password hash: bcrypt.hashSync('admin123', 10)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@vintagedago.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IjmFG4kYLHXN8p5Q7dqYz5BqYMZjPa', 'admin')
ON DUPLICATE KEY UPDATE email=email;
