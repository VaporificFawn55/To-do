const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/tasks?list_id=3
router.get('/', async (req, res) => {
  const { list_id } = req.query;

  try {
    let result;

    if (list_id) {
      // Return tasks for a specific list
      result = await pool.query(
        'SELECT * FROM tasks WHERE list_id = $1 AND user_id = $2 ORDER BY created_at ASC',
        [list_id, req.user.id]
      );
    } else {
      // Return ALL tasks for the user (useful for a "My Day" or "All Tasks" view)
      result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at ASC',
        [req.user.id]
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// POST /api/tasks
router.post('/', async (req, res) => {
  const { list_id, title, notes, due_date } = req.body;

  if (!list_id || !title) {
    return res.status(400).json({ error: 'list_id and title are required' });
  }

  try {
    // Verify the list belongs to this user before adding a task to it
    const listCheck = await pool.query(
      'SELECT id FROM lists WHERE id = $1 AND user_id = $2',
      [list_id, req.user.id]
    );

    if (listCheck.rows.length === 0) {
      return res.status(403).json({ error: 'List not found or access denied' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (user_id, list_id, title, notes, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, list_id, title, notes || null, due_date || null]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, notes, due_date, is_completed } = req.body;

  const updates = [];
  const values = [];
  let idx = 1;

  if (title !== undefined)        { updates.push(`title = $${idx++}`);        values.push(title); }
  if (notes !== undefined)        { updates.push(`notes = $${idx++}`);        values.push(notes || null); }
  if (due_date !== undefined)     { updates.push(`due_date = $${idx++}`);     values.push(due_date || null); }
  if (is_completed !== undefined) { updates.push(`is_completed = $${idx++}`); values.push(is_completed); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id, req.user.id);

  try {
    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted', id: result.rows[0].id });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;