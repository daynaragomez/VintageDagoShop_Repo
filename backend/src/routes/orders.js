const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { authenticateToken, requireRole } = require('../middleware/auth');

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// GET /api/orders � list all orders with customer name and totals (PROTECTED - Admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        o.id,
        o.status,
        o.subtotal,
        o.tax,
        o.total,
        o.created_at,
        c.name  AS customer_name,
        c.email AS customer_email
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id � full order detail with address and line items (PROTECTED - Admin only)
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const [[order]] = await pool.query(`
      SELECT
        o.id,
        o.status,
        o.subtotal,
        o.tax,
        o.total,
        o.created_at,
        c.id    AS customer_id,
        c.name  AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        a.street, a.city, a.state, a.zip_code, a.country
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN addresses a ON a.id = o.address_id
      WHERE o.id = ?
    `, [id]);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const [items] = await pool.query(`
      SELECT
        oi.quantity,
        oi.unit_price,
        p.id   AS product_id,
        p.name AS product_name
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status � update order status (PROTECTED - Admin only)
router.patch('/:id/status', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ orderId: Number(id), status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders � create new order (PUBLIC - Used by checkout)
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
