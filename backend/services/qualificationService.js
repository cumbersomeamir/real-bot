const prisma = require('../config/database');
const prompts = require('../integrations/openai/prompts');
const { runLLM } = require('../integrations/openai/client');
const { toStructuredOutput } = require('../integrations/openai/structuredOutput');

function computeHeuristicQualification(lead) {
  const score = lead?.score || 0;
  const status = score >= 80 ? 'HOT' : score >= 60 ? 'WARM' : 'COLD';
  const qualified = score >= 60;
  return { qualified, status, confidence: Math.min(0.95, Math.max(0.4, score / 100)) };
}

async function qualifyLead(leadId, { actorUserId } = {}) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { project: true, assignedBroker: true } });
  if (!lead) throw new Error('Lead not found');

  const heuristic = computeHeuristicQualification(lead);

  const prompt = [
    prompts.qualification,
    '',
    `Lead: ${lead.name} (${lead.phone}${lead.email ? `, ${lead.email}` : ''})`,
    `Source: ${lead.source}`,
    `Current status: ${lead.status}`,
    `Score: ${lead.score}`,
    `Project: ${lead.project?.name || 'n/a'}`,
    `Assigned broker: ${lead.assignedBroker?.name || 'n/a'}`,
    '',
    'Return a 1-paragraph summary and any key missing fields (budget, timeline, configuration).'
  ].join('\n');

  const t0 = Date.now();
  const llm = await runLLM(prompt);
  const structured = toStructuredOutput(llm.output);
  const latencyMs = Date.now() - t0;

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      isQualified: heuristic.qualified,
      qualifiedAt: heuristic.qualified ? new Date() : null,
      status: heuristic.qualified ? 'QUALIFIED' : lead.status,
      score: lead.score || 0,
      scoreBreakdown: lead.scoreBreakdown || {},
      notes: lead.notes ? `${lead.notes}\n\n[AI Qualification]\n${structured.summary}` : `[AI Qualification]\n${structured.summary}`
    }
  });

  await prisma.agentLog.create({
    data: {
      agentType: 'qualification',
      action: 'qualify',
      leadId,
      input: { leadId, heuristic, promptPreview: prompt.slice(0, 800) },
      output: { model: llm.model, structured },
      tokensUsed: null,
      latencyMs,
      success: true,
      error: null
    }
  });

  if (actorUserId) {
    await prisma.activity.create({
      data: {
        type: 'qualification',
        description: heuristic.qualified ? 'Lead qualified' : 'Qualification attempted',
        leadId,
        userId: actorUserId,
        metadata: { confidence: heuristic.confidence, summary: structured.summary }
      }
    });
  }

  return {
    leadId,
    qualified: heuristic.qualified,
    status: updated.status,
    summary: structured.summary,
    confidence: structured.confidence ?? heuristic.confidence,
    completedAt: new Date().toISOString()
  };
}

module.exports = { qualifyLead };
