const { Worker } = require('bullmq');
const redis = require('../../config/redis');
const prisma = require('../../config/database');
const { qualifyLead } = require('../../services/qualificationService');
const { scoreLead } = require('../../services/scoringService');
const { useBullMQ } = require('../mode');

module.exports = useBullMQ() && redis
  ? new Worker(
      'leadProcessing',
      async (job) => {
        const { leadId, type, actorUserId } = job.data || {};
        if (!leadId) throw new Error('leadId missing');

        if (type === 'qualify') {
          const result = await qualifyLead(leadId, { actorUserId });
          return { processed: true, type, result };
        }

        if (type === 'score') {
          const lead = await prisma.lead.findUnique({ where: { id: leadId } });
          if (!lead) throw new Error('Lead not found');
          const s = scoreLead(lead);
          const updated = await prisma.lead.update({
            where: { id: leadId },
            data: { score: s.score, scoreBreakdown: s.scoreBreakdown }
          });
          if (actorUserId) {
            await prisma.activity.create({
              data: {
                type: 'scoring',
                description: `Lead scored: ${s.score}`,
                leadId,
                userId: actorUserId,
                metadata: s.scoreBreakdown
              }
            });
          }
          return { processed: true, type, lead: updated };
        }

        return { processed: false, reason: 'unknown_type', type: type || null };
      },
      { connection: redis }
    )
  : null;
