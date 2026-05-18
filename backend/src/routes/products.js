const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
