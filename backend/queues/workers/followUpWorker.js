const { Worker } = require('bullmq');
const redis = require('../../config/redis');
const prisma = require('../../config/database');
const communicationService = require('../../services/communicationService');
const { useBullMQ } = require('../mode');

module.exports = useBullMQ() && redis
  ? new Worker(
      'followUp',
      async (job) => {
        const followUpId = job.data?.followUpId;
        if (!followUpId) throw new Error('followUpId missing');

        const followUp = await prisma.followUp.findUnique({
          where: { id: followUpId },
          include: { lead: true }
        });
        if (!followUp) throw new Error('FollowUp not found');
        if (followUp.status !== 'PENDING') return { skipped: true, status: followUp.status };

        try {
          const comm = await communicationService.queueMessage({
            organizationId: followUp.lead.organizationId,
            leadId: followUp.leadId,
            channel: followUp.channel,
            content: followUp.content,
            metadata: { followUpId: followUp.id, sequenceDay: followUp.sequenceDay, type: followUp.type }
          });

          await prisma.followUp.update({
            where: { id: followUp.id },
            data: { status: 'EXECUTED', executedAt: new Date(), result: `Queued communication ${comm.id}` }
          });

          return { executed: true, followUpId: followUp.id, communicationId: comm.id };
        } catch (error) {
          await prisma.followUp.update({
            where: { id: followUp.id },
            data: { status: 'FAILED', result: error.message || 'Failed' }
          });
          throw error;
        }
      },
      { connection: redis }
    )
  : null;
