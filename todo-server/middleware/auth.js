const { jwtVerify } = require('jose');
require('dotenv').config();

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

module.exports = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Not authenticated.' });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
};
