const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'communication',
  async (job) => {
    return { delivered: true, channel: job.data.channel || 'WHATSAPP' };
  },
  { connection: redis }
);
