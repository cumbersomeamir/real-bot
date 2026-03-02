const { Queue } = require('bullmq');
const redis = require('../config/redis');

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  },
  removeOnComplete: 100,
  removeOnFail: 200
};

function createQueue(name, limiter) {
  return new Queue(name, {
    connection: redis,
    defaultJobOptions,
    ...(limiter ? { limiter } : {})
  });
}

module.exports = { createQueue };
