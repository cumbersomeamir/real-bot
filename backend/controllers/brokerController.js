const prisma = require('../config/database');
const brokerService = require('../services/brokerService');
const { success, failure } = require('../utils/response');

async function list(req, res) {
  const orgId = req.user.organizationId;
  const items = await brokerService.listBrokers(orgId);
  return res.json(success({ items }));
}

async function getById(req, res) {
  const broker = await brokerService.getBroker(req.params.id);
  if (!broker) return res.status(404).json(failure('NOT_FOUND', 'Broker not found'));
  return res.json(success(broker));
}

async function leads(req, res) {
  const items = await prisma.lead.findMany({ where: { assignedBrokerId: req.params.id, deletedAt: null } });
  return res.json(success({ items }));
}

async function performance(req, res) {
  const metrics = await brokerService.brokerMetrics(req.params.id, req.user.organizationId);
  return res.json(success(metrics));
}

async function leaderboard(req, res) {
  const orgId = req.user.organizationId;
  const brokers = await brokerService.listBrokers(orgId);

  // Score: blend conversion + responsiveness + closures
  const scored = brokers.map((b) => {
    const conv = Number(String(b.conversionRate).replace('%', '')) || 0;
    const closures = b.monthClosures || 0;
    const resp = b.responseTime || '-';
    const respScore = resp === '-' ? 40 : Math.max(10, 100 - (parseInt(resp, 10) || 0) * 3);
    const score = Math.round(conv * 4 + closures * 6 + respScore * 0.3);
    return { broker: b.name, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const items = scored.slice(0, 10).map((s, idx) => ({ rank: idx + 1, broker: s.broker, score: s.score }));
  return res.json(success({ items }));
}

module.exports = {
  list,
  getById,
  leads,
  performance,
  leaderboard
};
