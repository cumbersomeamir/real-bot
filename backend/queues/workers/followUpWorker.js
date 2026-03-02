const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'followUp',
  async (job) => {
    return { executed: true, leadId: job.data.leadId || null };
  },
  { connection: redis }
);
