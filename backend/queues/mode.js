const env = require('../config/env');

function useBullMQ() {
  return env.QUEUE_MODE === 'bullmq';
}

module.exports = { useBullMQ };
