const { Worker } = require('bullmq');
const redis = require('../../config/redis');

module.exports = new Worker(
  'voiceCall',
  async (job) => {
    return { callQueued: true, leadId: job.data.leadId || null };
  },
  { connection: redis }
);
