const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');
const rateLimit = require('express-rate-limit');
const pool = require('../db');

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, password_hash]
    );

    const token = await new SignJWT({ id: newUser.rows[0].id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(getSecret());

    res.cookie('token', token, COOKIE_OPTS);
    res.status(201).json({ user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(getSecret());

    res.cookie('token', token, COOKIE_OPTS);
    res.json({ user: { id: user.id, email: user.email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ message: 'Logged out.' });
});

module.exports = router;
