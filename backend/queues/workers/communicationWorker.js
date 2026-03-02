const { Worker } = require('bullmq');
const redis = require('../../config/redis');
const { deliverCommunication } = require('../../services/deliveryService');
const { useBullMQ } = require('../mode');

module.exports = useBullMQ() && redis
  ? new Worker(
      'communication',
      async (job) => {
        const communicationId = job.data?.communicationId;
        if (!communicationId) throw new Error('communicationId missing');
        const result = await deliverCommunication(communicationId);
        return { delivered: result.delivered, providerId: result.providerId || null };
      },
      { connection: redis }
    )
  : null;
