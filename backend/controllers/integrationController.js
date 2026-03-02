const { success } = require('../utils/response');

function futureFeature(req, res) {
  return res.status(501).json({ status: 'not_implemented', message: 'Feature coming soon' });
}

module.exports = {
  futureFeature
};
