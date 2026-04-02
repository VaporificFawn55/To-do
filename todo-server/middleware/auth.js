const { jwtVerify } = require('jose');
require('dotenv').config();

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

module.exports = async (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 2. Verify the token and extract the payload
    const { payload } = await jwtVerify(token, getSecret());

    // 3. Attach the user id to the request object
    req.user = payload;
    next();

  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};