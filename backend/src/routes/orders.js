const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.post('/', async (req, res) => {
  const { name, email, phone, address, items } = req.body;

  // address expected: { street, city, state, zipCode, country }
  if (
    !name || !email || !address ||
    !address.street || !address.city || !address.country ||
    !Array.isArray(items) || items.length === 0
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Validate stock for all items upfront
    for (const item of items) {
      const [rows] = await conn.query(
        'SELECT stock FROM products WHERE id = ? FOR UPDATE',
        [item.productId]
      );
      if (rows.length === 0) throw new Error(`Product ${item.productId} not found`);
      if (rows[0].stock < item.quantity)
        throw new Error(`Insufficient stock for product ${item.productId}`);
    }

    // 2. Insert customer
    const [customerResult] = await conn.query(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone || null]
    );
    const customerId = customerResult.insertId;

    // 3. Insert address linked to customer
    const [addressResult] = await conn.query(
      'INSERT INTO addresses (customer_id, street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, address.street, address.city, address.state || null, address.zipCode || null, address.country]
    );
    const addressId = addressResult.insertId;

    // 4. Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = parseFloat((subtotal * 0.15).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // 5. Insert order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_id, address_id, subtotal, tax, total) VALUES (?, ?, ?, ?, ?)',
      [customerId, addressId, subtotal, tax, total]
    );
    const orderId = orderResult.insertId;

    // 6. Insert order items and decrement stock
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.unitPrice]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await conn.commit();
    res.status(201).json({ orderId, subtotal, tax, total });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;

