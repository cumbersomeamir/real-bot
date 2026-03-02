const prisma = require('../config/database');
const { success } = require('../utils/response');

function list(req, res) {
  return res.json(success({
    items: [
      { type: 'qualification', active: true, successRate: 0.94 },
      { type: 'followup', active: true, successRate: 0.91 },
      { type: 'reactivation', active: true, successRate: 0.83 },
      { type: 'voice', active: false, successRate: 0.79 },
      { type: 'analytics', active: true, successRate: 0.96 }
    ]
  }));
}

async function getByType(req, res) {
  const logs = await prisma.agentLog.findMany({ where: { agentType: req.params.type }, take: 20, orderBy: { createdAt: 'desc' } });
  return res.json(success({
    type: req.params.type,
    config: { active: true, thresholds: { hot: 80, warm: 50 } },
    metrics: { successRate: 0.91, avgLatencyMs: 850 },
    logs
  }));
}

function updateConfig(req, res) {
  return res.json(success({ type: req.params.type, config: req.body }, 'Agent config updated'));
}

function toggle(req, res) {
  return res.json(success({ type: req.params.type, active: Boolean(req.body.active) }, 'Agent toggled'));
}

async function logs(req, res) {
  const items = await prisma.agentLog.findMany({ where: { agentType: req.params.type }, take: 50, orderBy: { createdAt: 'desc' } });
  return res.json(success({ items }));
}

function runQualification(req, res) {
  return res.json(success({ leadId: req.params.leadId, runId: `run-${Date.now()}` }, 'Qualification run queued'));
}

function startReactivation(req, res) {
  return res.json(success({ campaignId: `react-${Date.now()}`, status: 'started' }, 'Reactivation campaign started'));
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
