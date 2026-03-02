const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'scoring',
  async (job) => {
    return { rescored: true, leadId: job.data.leadId || null };
  },
  { connection: redis }
);
