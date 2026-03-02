const { failure } = require('../utils/response');

function rbac(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(failure('FORBIDDEN', 'Insufficient permissions'));
    }
    return next();
  };
}

module.exports = rbac;
