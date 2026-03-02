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
  return res.json(success({
    responseTime: '4m 12s',
    conversionRate: 12.5,
    firstCallRate: 83,
    monthlyClosures: 7
  }));
}

async function leaderboard(req, res) {
  return res.json(success({
    items: [
      { rank: 1, broker: 'Aman Shah', score: 94 },
      { rank: 2, broker: 'Ritu Singh', score: 89 },
      { rank: 3, broker: 'Karan Rao', score: 81 }
    ]
  }));
}

module.exports = {
  list,
  getById,
  leads,
  performance,
  leaderboard
};
