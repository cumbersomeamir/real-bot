const { Queue } = require('bullmq');
const redis = require('../config/redis');
const { useBullMQ } = require('./mode');

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
  if (!useBullMQ()) {
    return {
      name,
      add: async () => ({ id: null, skipped: true, mode: 'polling' }),
      getJobCounts: async () => ({ waiting: 0, active: 0, delayed: 0, failed: 0, completed: 0, mode: 'polling' })
    };
  }
  if (!redis) {
    throw new Error('REDIS_URL is required for QUEUE_MODE=bullmq');
  }
  return new Queue(name, {
    connection: redis,
    defaultJobOptions,
    ...(limiter ? { limiter } : {})
  });
}

module.exports = { createQueue };
