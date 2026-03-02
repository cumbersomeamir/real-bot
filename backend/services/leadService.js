const prisma = require('../config/database');

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
  return prisma.lead.create({ data });
}

async function updateLead(id, data) {
  return prisma.lead.update({ where: { id }, data });
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
