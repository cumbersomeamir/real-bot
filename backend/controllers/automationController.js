const ruleEngineService = require('../services/ruleEngineService');
const { success } = require('../utils/response');
const prisma = require('../config/database');

async function list(req, res) {
  const items = await ruleEngineService.listRules(req.user.organizationId);
  return res.json(success({ items }));
}

async function create(req, res) {
  const item = await ruleEngineService.createRule({ ...req.body, organizationId: req.user.organizationId });
  return res.status(201).json(success(item, 'Rule created'));
}

async function update(req, res) {
  const item = await ruleEngineService.updateRule(req.params.id, req.body);
  return res.json(success(item, 'Rule updated'));
}

async function remove(req, res) {
  await ruleEngineService.deleteRule(req.params.id);
  return res.json(success({}, 'Rule deleted'));
}

async function test(req, res) {
  const rule = await prisma.automationRule.findUnique({ where: { id: req.params.id } });
  if (!rule) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Rule not found', details: [] } });

  const leadId = req.body?.leadId || req.body?.id || null;
  const lead = leadId ? await prisma.lead.findUnique({ where: { id: leadId } }) : null;
  const matched = lead ? ruleEngineService.matchAll(lead, rule.conditions) : false;

  const actions = Array.isArray(rule.actions) ? rule.actions : [];
  const actionsTriggered = matched ? actions.map((a) => a?.type).filter(Boolean) : [];

  return res.json(success({ matched, actionsTriggered, leadId: leadId || null }, 'Rule test complete'));
}

async function history(req, res) {
  const raw = await prisma.activity.findMany({
    where: { type: 'automation' },
    take: 200,
    orderBy: { createdAt: 'desc' }
  });
  const items = raw.filter((a) => a?.metadata?.ruleId === req.params.id).slice(0, 50);
  return res.json(success({ items }));
}

module.exports = { list, create, update, remove, test, history };
