const prisma = require('../config/database');

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

module.exports = { listRules, createRule, updateRule, deleteRule };
