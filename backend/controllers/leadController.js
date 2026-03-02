const prisma = require('../config/database');
const { success, failure } = require('../utils/response');
const leadService = require('../services/leadService');
const { scoreLead } = require('../services/scoringService');
const { qualifyLead } = require('../services/qualificationService');

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
    organizationId: req.body.organizationId || req.user.organizationId
  });
  return res.status(201).json(success(lead, 'Lead created'));
}

async function update(req, res) {
  const lead = await leadService.updateLead(req.params.id, req.body);
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
  return res.json(success(lead, 'Lead assigned'));
}

async function qualify(req, res) {
  const result = await qualifyLead(req.params.id);
  await prisma.lead.update({
    where: { id: req.params.id },
    data: { isQualified: true, status: 'QUALIFIED', qualifiedAt: new Date() }
  });
  return res.json(success(result, 'Qualification triggered'));
}

async function score(req, res) {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json(failure('NOT_FOUND', 'Lead not found'));
  const score = scoreLead(lead);
  const updated = await prisma.lead.update({
    where: { id: req.params.id },
    data: { score: score.score, scoreBreakdown: score.scoreBreakdown }
  });
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
