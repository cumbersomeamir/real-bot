const cron = require('node-cron');
const env = require('./config/env');
const prisma = require('./config/database');
const communicationService = require('./services/communicationService');

function startPollingScheduler() {
  if (env.QUEUE_MODE !== 'polling') return null;

  // Every 15 seconds: execute due follow-ups.
  const task = cron.schedule('*/15 * * * * *', async () => {
    const now = new Date();
    const due = await prisma.followUp.findMany({
      where: { status: 'PENDING', scheduledAt: { lte: now } },
      take: 25,
      orderBy: { scheduledAt: 'asc' },
      include: { lead: true }
    });

    for (const f of due) {
      try {
        const comm = await communicationService.queueMessage({
          organizationId: f.lead.organizationId,
          leadId: f.leadId,
          channel: f.channel,
          content: f.content,
          metadata: { followUpId: f.id, sequenceDay: f.sequenceDay, type: f.type, mode: 'polling' }
        });

        await prisma.followUp.update({
          where: { id: f.id },
          data: { status: 'EXECUTED', executedAt: new Date(), result: `Sent communication ${comm.id}` }
        });
      } catch (error) {
        await prisma.followUp.update({
          where: { id: f.id },
          data: { status: 'FAILED', result: error.message || 'Failed' }
        });
      }
    }
  });

  task.start();
  return task;
}

module.exports = { startPollingScheduler };
