-- Product catalog seed data. Safe to load in a fresh production database.
INSERT INTO categories (name, slug) VALUES
  ('Jackets', 'jackets'),
  ('Bottoms', 'bottoms'),
  ('Tops', 'tops'),
  ('Accessories', 'accessories')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT 'Vintage Leather Jacket', 89.99,
       'Classic brown leather jacket from the 80s',
       'Genuine leather, fully lined, two front pockets, silver zipper. A timeless piece from the golden era of rock and roll.',
       c.id, 'https://via.placeholder.com/600x800/8B4513/FFF?text=Leather+Jacket', 5
FROM categories c
WHERE c.slug = 'jackets'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Vintage Leather Jacket');

INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT 'Retro Denim Jeans', 45.50,
       'High-waisted denim jeans, vintage style',
       'High-rise cut, straight leg, 100% cotton denim. Pre-washed for that authentic worn-in look from the 70s.',
       c.id, 'https://via.placeholder.com/600x800/4169E1/FFF?text=Denim+Jeans', 8
FROM categories c
WHERE c.slug = 'bottoms'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Retro Denim Jeans');

INSERT INTO products (name, price, description, details, category_id, image, stock)
SELECT 'Vintage Band T-Shirt', 29.99,
       'Original 90s rock band t-shirt',
       'Screen-printed graphic tee, pre-shrunk cotton, crew neck. Authentic piece from the 1990s grunge era.',
       c.id, 'https://via.placeholder.com/600x800/FF6347/FFF?text=Band+T-Shirt', 12
FROM categories c
WHERE c.slug = 'tops'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Vintage Band T-Shirt');