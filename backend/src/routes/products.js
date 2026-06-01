const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const {
      q = '',
      category = '',
      minPrice = '',
      maxPrice = '',
      page = '1',
      limit = '12',
    } = req.query;

    const filters = [];
    const params = [];

    if (q.trim()) {
      filters.push('LOWER(p.name) LIKE ?');
      params.push(`%${q.trim().toLowerCase()}%`);
    }

    if (category.trim() && category !== 'All') {
      filters.push('c.name = ?');
      params.push(category.trim());
    }

    if (minPrice !== '') {
      filters.push('p.price >= ?');
      params.push(Number(minPrice));
    }

    if (maxPrice !== '') {
      filters.push('p.price <= ?');
      params.push(Number(maxPrice));
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 12));
    const offset = (safePage - 1) * safeLimit;

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${whereClause}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.description, p.details,
              c.name AS category, p.image, p.stock, p.created_at
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${whereClause}
       ORDER BY p.id ASC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    );

    const [categoryRows] = await pool.query(
      `SELECT DISTINCT c.name
       FROM categories c
       JOIN products p ON p.category_id = c.id
       ORDER BY c.name ASC`
    );

    const total = countRows[0]?.total ?? 0;
    res.json({
      products: rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
      filters: {
        q: q.trim(),
        category: category.trim(),
        minPrice: minPrice !== '' ? Number(minPrice) : null,
        maxPrice: maxPrice !== '' ? Number(maxPrice) : null,
      },
      categories: categoryRows.map((row) => row.name),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.description, p.details,
              c.name AS category, p.image, p.stock, p.created_at
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;

