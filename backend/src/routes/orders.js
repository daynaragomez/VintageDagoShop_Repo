const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.post('/', async (req, res) => {
  const { name, email, address, items } = req.body;

  if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const item of items) {
      const [rows] = await conn.query(
        'SELECT stock FROM products WHERE id = ? FOR UPDATE',
        [item.productId]
      );
      if (rows.length === 0) throw new Error(`Product ${item.productId} not found`);
      if (rows[0].stock < item.quantity) throw new Error(`Insufficient stock for product ${item.productId}`);
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_name, customer_email, shipping_address, total) VALUES (?, ?, ?, ?)',
      [name, email, address, total]
    );
    const orderId = orderResult.insertId;

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
    res.status(201).json({ orderId, total });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
