-- Development and staging fixtures only. Never load this file in production.

INSERT INTO customers (name, email, phone) VALUES
  ('Jane Doe', 'jane@example.com', '514-555-0100');

INSERT INTO addresses (customer_id, street, city, state, zip_code, country) VALUES
  (1, '123 Rue Sainte-Catherine', 'Montreal', 'Quebec', 'H3B 1A1', 'Canada');

INSERT INTO orders (customer_id, address_id, subtotal, tax, total, status) VALUES
  (1, 1, 89.99, 13.50, 103.49, 'confirmed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 89.99);

-- Local test admin; these credentials must never be used outside development.
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@vintagedago.com', '$2b$10$cYx1d0dGgSDHJxztRvymt.oCuW8MkzTG5it5MWjy7HIfqUhXv73vK', 'admin')
ON DUPLICATE KEY UPDATE email = email;
