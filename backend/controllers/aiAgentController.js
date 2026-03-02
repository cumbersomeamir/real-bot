const prisma = require('../config/database');
const { success } = require('../utils/response');
const leadProcessingQueue = require('../queues/leadProcessingQueue');
const reactivationQueue = require('../queues/reactivationQueue');
const { useBullMQ } = require('../queues/mode');
const { qualifyLead } = require('../services/qualificationService');
const { startCampaign } = require('../services/reactivationService');

async function list(req, res) {
  const types = ['qualification', 'followup', 'reactivation', 'voice', 'analytics'];
  const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
  const config = org?.settings?.aiAgents || {};

  const items = await Promise.all(
    types.map(async (type) => {
      const logs = await prisma.agentLog.findMany({
        where: { agentType: type },
        take: 200,
        orderBy: { createdAt: 'desc' },
        select: { success: true, latencyMs: true }
      });
      const total = logs.length || 0;
      const ok = logs.filter((l) => l.success).length;
      const avgLatencyMs = total ? Math.round(logs.reduce((a, b) => a + (b.latencyMs || 0), 0) / total) : 0;
      return {
        type,
        active: config?.[type]?.active ?? true,
        successRate: total ? Number((ok / total).toFixed(2)) : 1,
        avgLatencyMs
      };
    })
  );

  return res.json(success({ items }));
}

async function getByType(req, res) {
  const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
  const aiAgents = org?.settings?.aiAgents || {};
  const config = aiAgents?.[req.params.type] || { active: true, thresholds: { hot: 80, warm: 50 } };

  const logs = await prisma.agentLog.findMany({
    where: { agentType: req.params.type },
    take: 50,
    orderBy: { createdAt: 'desc' }
  });

  const total = logs.length || 0;
  const ok = logs.filter((l) => l.success).length;
  const avgLatencyMs = total ? Math.round(logs.reduce((a, b) => a + (b.latencyMs || 0), 0) / total) : 0;

  return res.json(
    success({
      type: req.params.type,
      config,
      metrics: { successRate: total ? Number((ok / total).toFixed(2)) : 1, avgLatencyMs },
      logs
    })
  );
}

async function updateConfig(req, res) {
  const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
  const settings = org?.settings || {};
  const aiAgents = settings.aiAgents || {};
  const next = { ...settings, aiAgents: { ...aiAgents, [req.params.type]: { ...(aiAgents[req.params.type] || {}), ...req.body } } };

  await prisma.organization.update({ where: { id: req.user.organizationId }, data: { settings: next } });
  return res.json(success({ type: req.params.type, config: next.aiAgents[req.params.type] }, 'Agent config updated'));
}

async function toggle(req, res) {
  const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
  const settings = org?.settings || {};
  const aiAgents = settings.aiAgents || {};
  const updated = { ...(aiAgents[req.params.type] || {}), active: Boolean(req.body.active) };
  const next = { ...settings, aiAgents: { ...aiAgents, [req.params.type]: updated } };
  await prisma.organization.update({ where: { id: req.user.organizationId }, data: { settings: next } });
  return res.json(success({ type: req.params.type, active: updated.active }, 'Agent toggled'));
}

async function logs(req, res) {
  const items = await prisma.agentLog.findMany({
    where: { agentType: req.params.type },
    take: 50,
    orderBy: { createdAt: 'desc' }
  });
  return res.json(success({ items }));
}

async function runQualification(req, res) {
  const runId = `run-${Date.now()}`;
  if (useBullMQ()) {
    await leadProcessingQueue.add('qualification', { type: 'qualify', leadId: req.params.leadId, actorUserId: req.user?.id, runId });
    return res.json(success({ leadId: req.params.leadId, runId }, 'Qualification queued'));
  }
  const result = await qualifyLead(req.params.leadId, { actorUserId: req.user?.id });
  return res.json(success({ leadId: req.params.leadId, runId, result }, 'Qualification completed'));
}

async function startReactivation(req, res) {
  const campaignId = `react-${Date.now()}`;
  if (useBullMQ()) {
    await reactivationQueue.add('reactivation', { campaignId, organizationId: req.user.organizationId, actorUserId: req.user?.id, ...req.body });
    return res.json(success({ campaignId, status: 'queued' }, 'Reactivation campaign queued'));
  }
  const result = await startCampaign({
    organizationId: req.user.organizationId,
    actorUserId: req.user?.id,
    name: req.body?.name || campaignId,
    maxLeads: req.body?.maxLeads || 50
  });
  return res.json(success({ campaignId, ...result }, 'Reactivation campaign started'));
}

module.exports = {
  list,
  getByType,
  updateConfig,
  toggle,
  logs,
  runQualification,
  startReactivation
};
