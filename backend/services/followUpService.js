const prisma = require('../config/database');
const followUpQueue = require('../queues/followUpQueue');
const templates = require('../integrations/whatsapp/templates');

const DEFAULT_SEQUENCE = [
  { day: 0, type: 'day0_brochure', channel: 'WHATSAPP', templateKey: 'day0Brochure' },
  { day: 2, type: 'day2_visit', channel: 'WHATSAPP', templateKey: 'day2Visit' },
  { day: 5, type: 'day5_inventory', channel: 'WHATSAPP', templateKey: 'day5Inventory' }
];

function scheduledAtFromNow(days) {
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

async function triggerFollowUp(leadId, { actorUserId, sequence = DEFAULT_SEQUENCE } = {}) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { project: true } });
  if (!lead) throw new Error('Lead not found');

  const created = [];
  for (const step of sequence) {
    const scheduledAt = scheduledAtFromNow(step.day);
    const content = templates?.[step.templateKey] || `Follow-up (${step.type})`;
    const item = await prisma.followUp.create({
      data: {
        leadId,
        sequenceDay: step.day,
        type: step.type,
        channel: step.channel,
        scheduledAt,
        content,
        result: null
      }
    });
    created.push(item);

    const delayMs = Math.max(0, scheduledAt.getTime() - Date.now());
    await followUpQueue.add(
      'execute',
      { followUpId: item.id, leadId, actorUserId: actorUserId || null },
      { delay: delayMs, removeOnComplete: true, removeOnFail: false }
    );
  }

  const nextFollowUpAt = created
    .map((f) => f.scheduledAt)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

  await prisma.lead.update({
    where: { id: leadId },
    data: { nextFollowUpAt: nextFollowUpAt || null }
  });

  if (actorUserId) {
    await prisma.activity.create({
      data: {
        type: 'followup',
        description: `Follow-up sequence scheduled (${created.length} steps)`,
        leadId,
        userId: actorUserId,
        metadata: { sequence: created.map((c) => ({ day: c.sequenceDay, channel: c.channel, scheduledAt: c.scheduledAt })) }
      }
    });
  }

  return {
    leadId,
    triggered: true,
    sequence: created.map((c) => c.sequenceDay),
    nextFollowUpAt
  };
}

module.exports = { triggerFollowUp, DEFAULT_SEQUENCE };
