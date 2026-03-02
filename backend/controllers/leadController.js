const prisma = require('../config/database');
const { success, failure } = require('../utils/response');
const leadService = require('../services/leadService');
const { scoreLead } = require('../services/scoringService');
const { qualifyLead } = require('../services/qualificationService');

function emitOrg(req, event, payload) {
  try {
    const io = req.app?.get('io');
    const orgId = req.user?.organizationId;
    if (!io || !orgId) return;
    io.to(`org:${orgId}`).emit(event, payload);
  } catch {
    // no-op
  }
}

async function list(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const data = await leadService.listLeads({ page, limit });
  return res.json(success({ items: data.items, meta: data.meta }, 'Success', data.meta));
}

async function getById(req, res) {
  const lead = await leadService.getLead(req.params.id);
  if (!lead) return res.status(404).json(failure('NOT_FOUND', 'Lead not found'));
  return res.json(success(lead));
}

async function create(req, res) {
  const lead = await leadService.createLead({
    ...req.body,
    organizationId: req.body.organizationId || req.user.organizationId,
    createdById: req.user?.id || null
  });
  emitOrg(req, 'lead:new', { id: lead.id, status: lead.status, assignedBrokerId: lead.assignedBrokerId || null });
  emitOrg(req, 'kpi:update', { at: new Date().toISOString(), reason: 'lead:new' });
  return res.status(201).json(success(lead, 'Lead created'));
}

async function update(req, res) {
  const lead = await leadService.updateLead(req.params.id, req.body);
  emitOrg(req, 'lead:updated', { id: lead.id, status: lead.status, assignedBrokerId: lead.assignedBrokerId || null });
  emitOrg(req, 'kpi:update', { at: new Date().toISOString(), reason: 'lead:updated' });
  return res.json(success(lead, 'Lead updated'));
}

async function remove(req, res) {
  await leadService.softDeleteLead(req.params.id);
  return res.json(success({}, 'Lead soft deleted'));
}

async function importCSV(req, res) {
  return res.json(success({ imported: 0, deduped: 0 }, 'CSV import queued'));
}

async function assign(req, res) {
  const lead = await leadService.assignLead(req.params.id, req.body.brokerId);
  emitOrg(req, 'lead:assigned', { id: lead.id, assignedBrokerId: lead.assignedBrokerId });
  emitOrg(req, 'kpi:update', { at: new Date().toISOString(), reason: 'lead:assigned' });
  return res.json(success(lead, 'Lead assigned'));
}

async function qualify(req, res) {
  const result = await qualifyLead(req.params.id, { actorUserId: req.user?.id });
  emitOrg(req, 'lead:updated', { id: req.params.id, status: result.status });
  emitOrg(req, 'kpi:update', { at: new Date().toISOString(), reason: 'lead:qualified' });
  return res.json(success(result, 'Qualification completed'));
}

async function score(req, res) {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json(failure('NOT_FOUND', 'Lead not found'));
  const score = scoreLead(lead);
  const updated = await prisma.lead.update({
    where: { id: req.params.id },
    data: { score: score.score, scoreBreakdown: score.scoreBreakdown }
  });
  emitOrg(req, 'lead:updated', { id: updated.id, score: updated.score });
  emitOrg(req, 'kpi:update', { at: new Date().toISOString(), reason: 'lead:scored' });
  return res.json(success(updated, 'Lead scored'));
}

async function timeline(req, res) {
  const items = await prisma.activity.findMany({ where: { leadId: req.params.id }, orderBy: { createdAt: 'desc' } });
  return res.json(success({ items }));
}

async function communications(req, res) {
  const items = await prisma.communication.findMany({ where: { leadId: req.params.id }, orderBy: { createdAt: 'desc' } });
  return res.json(success({ items }));
}

async function bulkAction(req, res) {
  const result = await leadService.bulkAction(req.body.ids || [], req.body);
  return res.json(success(result, 'Bulk action completed'));
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  importCSV,
  assign,
  qualify,
  score,
  timeline,
  communications,
  bulkAction
};
