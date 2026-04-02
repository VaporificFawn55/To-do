const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// get lists

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// creating tasks
router.post('/', async (req, res) => {
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'List name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO lists (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, name, color || 'blue']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// updating existing tasks
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  try {
    // Make sure this list belongs to the logged-in user before updating
    const result = await pool.query(
      'UPDATE lists SET name = COALESCE($1, name), color = COALESCE($2, color) WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, color, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// Delete tasks
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM lists WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json({ message: 'List deleted', id: result.rows[0].id });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;