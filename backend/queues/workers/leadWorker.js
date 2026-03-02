const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'leadProcessing',
  async (job) => {
    return { processed: true, leadId: job.data.leadId || null };
  },
  { connection: redis }
);
