const prisma = require('../config/database');
const { success } = require('../utils/response');

async function settings(req, res) {
  const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
  return res.json(success(org?.settings || {}));
}

async function updateSettings(req, res) {
  const org = await prisma.organization.update({
    where: { id: req.user.organizationId },
    data: { settings: req.body }
  });
  return res.json(success(org.settings, 'Settings updated'));
}

async function team(req, res) {
  const items = await prisma.user.findMany({ where: { organizationId: req.user.organizationId } });
  return res.json(success({ items }));
}

async function invite(req, res) {
  return res.status(201).json(success({ invited: req.body.email }, 'Invite sent'));
}

async function changeRole(req, res) {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  return res.json(success(user, 'Role updated'));
}

async function auditLogs(req, res) {
  const items = await prisma.auditLog.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
  return res.json(success({ items }));
}

async function apiKeys(req, res) {
  const items = await prisma.apiKey.findMany({ where: { organizationId: req.user.organizationId } });
  return res.json(success({ items }));
}

async function createApiKey(req, res) {
  const key = `df_${Math.random().toString(36).slice(2)}${Date.now()}`;
  const item = await prisma.apiKey.create({
    data: {
      name: req.body.name || 'Default key',
      key,
      organizationId: req.user.organizationId,
      permissions: req.body.permissions || []
    }
  });
  return res.status(201).json(success(item, 'API key created'));
}

module.exports = {
  settings,
  updateSettings,
  team,
  invite,
  changeRole,
  auditLogs,
  apiKeys,
  createApiKey
};
