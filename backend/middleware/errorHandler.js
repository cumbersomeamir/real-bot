const logger = require('../config/logger');
const { failure } = require('../utils/response');

function errorHandler(err, req, res, next) {
  logger.error({ message: err.message, stack: err.stack, path: req.path });
  return res.status(err.status || 500).json(failure(err.code || 'INTERNAL_ERROR', err.message || 'Unexpected error', err.details || []));
}

module.exports = errorHandler;
