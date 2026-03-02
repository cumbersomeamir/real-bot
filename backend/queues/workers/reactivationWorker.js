const { Worker } = require('bullmq');
const redis = require('../../config/redis');
const { useBullMQ } = require('../mode');
const { startCampaign } = require('../../services/reactivationService');

module.exports = useBullMQ() && redis
  ? new Worker(
      'reactivation',
      async (job) => {
        const campaignId = job.data?.campaignId || `react-${Date.now()}`;
        const result = await startCampaign({
          organizationId: job.data.organizationId,
          actorUserId: job.data.actorUserId || null,
          name: job.data.name || campaignId,
          maxLeads: job.data.maxLeads || 50
        });
        return { ...result, campaignId };
      },
      { connection: redis }
    )
  : null;
