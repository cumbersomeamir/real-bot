const { success } = require('../utils/response');

function run(req, res) {
  return res.json(success({ status: 'queued' }, 'Reactivation queued'));
}

module.exports = { run };
