const prisma = require('../config/database');
const prompts = require('../integrations/openai/prompts');
const { runLLM } = require('../integrations/openai/client');
const { toStructuredOutput } = require('../integrations/openai/structuredOutput');
const communicationService = require('./communicationService');

async function startCampaign({ organizationId, actorUserId, name, maxLeads = 50 } = {}) {
  if (!organizationId) throw new Error('organizationId is required');

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const leads = await prisma.lead.findMany({
    where: {
      organizationId,
      status: { in: ['COLD', 'DEAD', 'CONTACTED', 'WARM'] },
      AND: [
        { OR: [{ lastContactAt: { lt: cutoff } }, { lastContactAt: null }, { lastContactAt: { isSet: false } }] },
        { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] }
      ]
    },
    take: maxLeads,
    orderBy: { updatedAt: 'asc' }
  });

  const campaignId = `react-${Date.now()}`;
  let queued = 0;

  for (const lead of leads) {
    const prompt = [
      prompts.reactivation,
      '',
      `Lead: ${lead.name} (${lead.phone})`,
      `Last contact: ${lead.lastContactAt || 'never'}`,
      `Status: ${lead.status}`,
      'Write a short WhatsApp message to re-engage and ask if they want an updated inventory/brochure.'
    ].join('\n');
    const llm = await runLLM(prompt);
    const structured = toStructuredOutput(llm.output);

    await communicationService.queueMessage({
      organizationId,
      leadId: lead.id,
      channel: 'WHATSAPP',
      content: structured.summary,
      metadata: { campaignId, campaignName: name || 'Reactivation', mode: 'reactivation' },
      agentId: 'reactivation'
    });
    queued += 1;

    await prisma.lead.update({
      where: { id: lead.id },
      data: { isReactivated: true, reactivatedFrom: lead.status }
    });

    if (actorUserId) {
      await prisma.activity.create({
        data: {
          type: 'reactivation',
          description: 'Reactivation message queued',
          leadId: lead.id,
          userId: actorUserId,
          metadata: { campaignId }
        }
      });
    }
  }

  await prisma.agentLog.create({
    data: {
      agentType: 'reactivation',
      action: 'campaign',
      leadId: null,
      input: { campaignId, name: name || 'Reactivation', maxLeads },
      output: { queued },
      tokensUsed: null,
      latencyMs: 0,
      success: true,
      error: null
    }
  });

  return { campaignId, queued, scanned: leads.length, status: 'started' };
}

module.exports = { startCampaign };
