const prisma = require('../config/database');
const communicationService = require('./communicationService');
const { triggerFollowUp } = require('./followUpService');

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function getField(obj, field) {
  if (!field) return undefined;
  return field.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function matchCondition(lead, cond) {
  const field = cond?.field;
  const op = String(cond?.op || 'eq').toLowerCase();
  const expected = cond?.value;
  const actual = getField(lead, field);

  if (op === 'eq') return actual === expected;
  if (op === 'neq') return actual !== expected;
  if (op === 'gte') return Number(actual) >= Number(expected);
  if (op === 'lte') return Number(actual) <= Number(expected);
  if (op === 'in') return Array.isArray(expected) && expected.includes(actual);
  if (op === 'contains') return Array.isArray(actual) ? actual.includes(expected) : String(actual || '').includes(String(expected));
  return false;
}

function matchAll(lead, conditions) {
  const conds = asArray(conditions);
  if (!conds.length) return false;
  return conds.every((c) => matchCondition(lead, c));
}

async function listRules(organizationId) {
  return prisma.automationRule.findMany({ where: { organizationId }, orderBy: { priority: 'desc' } });
}

async function createRule(data) {
  return prisma.automationRule.create({ data });
}

async function updateRule(id, data) {
  return prisma.automationRule.update({ where: { id }, data });
}

async function deleteRule(id) {
  return prisma.automationRule.delete({ where: { id } });
}

async function pickBrokerId(organizationId) {
  const brokers = await prisma.user.findMany({ where: { organizationId, role: 'BROKER', isActive: true }, select: { id: true } });
  if (!brokers.length) return null;
  const idx = Math.floor(Math.random() * brokers.length);
  return brokers[idx].id;
}

async function runForLead(organizationId, lead, { actorUserId } = {}) {
  const rules = await prisma.automationRule.findMany({
    where: { organizationId, isActive: true },
    orderBy: { priority: 'desc' }
  });

  const matched = [];
  for (const rule of rules) {
    if (!matchAll(lead, rule.conditions)) continue;

    const actions = asArray(rule.actions);
    const triggered = [];

    for (const action of actions) {
      const type = String(action?.type || '').toLowerCase();

      if (type === 'assign_broker') {
        const brokerId = action?.value || (await pickBrokerId(organizationId));
        if (brokerId) {
          await prisma.lead.update({ where: { id: lead.id }, data: { assignedBrokerId: brokerId } });
          triggered.push({ type: 'assign_broker', brokerId });
        }
      } else if (type === 'send_template') {
        const templateId = action?.templateId || null;
        const comm = await communicationService.queueMessage({
          organizationId,
          leadId: lead.id,
          channel: action?.channel || 'WHATSAPP',
          templateId,
          content: action?.content || null,
          variables: action?.variables || {},
          metadata: { ruleId: rule.id, ruleName: rule.name, action: 'send_template' },
          agentId: action?.agentId || null
        });
        triggered.push({ type: 'send_template', communicationId: comm.id });
      } else if (type === 'schedule_followup') {
        const seq = action?.sequence || undefined;
        const result = await triggerFollowUp(lead.id, { actorUserId, sequence: seq });
        triggered.push({ type: 'schedule_followup', ...result });
      }
    }

    await prisma.automationRule.update({
      where: { id: rule.id },
      data: { triggerCount: { increment: 1 }, lastTriggeredAt: new Date() }
    });

    if (actorUserId) {
      await prisma.activity.create({
        data: {
          type: 'automation',
          description: `Rule matched: ${rule.name}`,
          leadId: lead.id,
          userId: actorUserId,
          metadata: { ruleId: rule.id, actions: triggered }
        }
      });
    }

    matched.push({ ruleId: rule.id, name: rule.name, triggered });
  }

  return { matched };
}

module.exports = { listRules, createRule, updateRule, deleteRule, runForLead, matchAll };
