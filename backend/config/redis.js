const IORedis = require('ioredis');
const env = require('./env');

const redis = env.REDIS_URL
  ? new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true
    })
  : null;

module.exports = redis;
