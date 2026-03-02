const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'reactivation',
  async (job) => {
    return { reactivated: true, batchId: job.data.batchId || null };
  },
  { connection: redis }
);
