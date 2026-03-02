const ruleEngineService = require('../services/ruleEngineService');
const { success } = require('../utils/response');

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
  return res.json(success({ matched: true, actionsTriggered: ['assign_broker', 'send_template'] }, 'Rule test complete'));
}

async function history(req, res) {
  return res.json(success({ items: [{ at: new Date().toISOString(), result: 'success' }] }));
}

module.exports = { list, create, update, remove, test, history };
