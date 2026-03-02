const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { failure } = require('../utils/response');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(failure('UNAUTHORIZED', 'Authorization header missing'));
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json(failure('INVALID_TOKEN', 'Invalid or expired token'));
  }
}

module.exports = auth;
