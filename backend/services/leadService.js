const prisma = require('../config/database');
const { scoreLead } = require('./scoringService');
const ruleEngineService = require('./ruleEngineService');
const { triggerFollowUp } = require('./followUpService');
const { isDuplicate } = require('./deduplicationService');

async function listLeads({ page = 1, limit = 20, filters = {}, sort = { createdAt: 'desc' } }) {
  const skip = (page - 1) * limit;
  const where = {
    ...filters,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };
  const [items, total] = await Promise.all([
    prisma.lead.findMany({ where, skip, take: limit, orderBy: sort }),
    prisma.lead.count({ where })
  ]);
  return { items, meta: { page, limit, total } };
}

async function getLead(id) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      communications: true,
      activities: true,
      followUps: true,
      siteVisits: true,
      deal: true
    }
  });
}

async function createLead(data) {
  const organizationId = data.organizationId;
  if (!organizationId) throw new Error('organizationId is required');

  const existing = await prisma.lead.findMany({
    where: {
      organizationId,
      AND: [
        { OR: [{ phone: data.phone }, ...(data.email ? [{ email: data.email }] : [])] },
        { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] }
      ]
    },
    take: 20
  });

  const duplicate = isDuplicate(existing, data);
  const duplicateOfId = duplicate ? existing.find((l) => l.phone === data.phone || (data.email && l.email === data.email))?.id || null : null;

  const initialScore = scoreLead({ ...data, isQualified: false });
  const created = await prisma.lead.create({
    data: {
      ...data,
      isDuplicate: duplicate,
      duplicateOfId,
      score: initialScore.score,
      scoreBreakdown: initialScore.scoreBreakdown
    }
  });

  // Schedule a follow-up sequence for fresh leads (duplicates are still visible but not auto-contacted).
  if (!duplicate) {
    await triggerFollowUp(created.id, { actorUserId: data.createdById || null });
  }

  // Run automation rules (assignment, templates, etc.)
  await ruleEngineService.runForLead(organizationId, created, { actorUserId: data.createdById || null });

  return created;
}

async function updateLead(id, data) {
  const updated = await prisma.lead.update({ where: { id }, data });
  await ruleEngineService.runForLead(updated.organizationId, updated, { actorUserId: null });
  return updated;
}

async function softDeleteLead(id) {
  return prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
}

async function assignLead(id, brokerId) {
  return prisma.lead.update({ where: { id }, data: { assignedBrokerId: brokerId } });
}

async function bulkAction(ids = [], payload = {}) {
  const update = {};
  if (payload.status) update.status = payload.status;
  if (payload.assignedBrokerId) update.assignedBrokerId = payload.assignedBrokerId;

  const result = await prisma.lead.updateMany({
    where: {
      id: { in: ids },
      OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
    },
    data: update
  });

  return result;
}

module.exports = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  softDeleteLead,
  assignLead,
  bulkAction
};
