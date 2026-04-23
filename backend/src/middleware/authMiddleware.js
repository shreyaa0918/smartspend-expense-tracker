const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    const err = new Error('Not authorized, token missing');
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }

  req.user = user;
  next();
});
