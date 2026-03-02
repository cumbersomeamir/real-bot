const prisma = require('../config/database');

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '-';
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m <= 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

async function brokerMetrics(brokerId, organizationId) {
  const whereLeads = {
    organizationId,
    assignedBrokerId: brokerId,
    OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }]
  };
  const assignedLeads = await prisma.lead.findMany({
    where: whereLeads,
    take: 300,
    select: { id: true, createdAt: true }
  });
  const leadIds = assignedLeads.map((l) => l.id);
  const activeLeads = assignedLeads.length;

  const outbound = leadIds.length
    ? await prisma.communication.findMany({
        where: { leadId: { in: leadIds }, direction: 'OUTBOUND' },
        orderBy: { createdAt: 'asc' },
        select: { leadId: true, createdAt: true }
      })
    : [];

  const leadCreatedAt = new Map(assignedLeads.map((l) => [l.id, l.createdAt]));
  const firstOutboundByLead = new Map();
  for (const c of outbound) {
    if (!firstOutboundByLead.has(c.leadId)) firstOutboundByLead.set(c.leadId, c.createdAt);
  }
  const deltas = [];
  for (const [leadId, firstAt] of firstOutboundByLead.entries()) {
    const createdAt = leadCreatedAt.get(leadId);
    if (!createdAt) continue;
    const d = new Date(firstAt).getTime() - new Date(createdAt).getTime();
    if (d > 0) deltas.push(d);
  }
  const avgResponseMs = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;

  const [deals, monthlyClosures] = await Promise.all([
    prisma.deal.count({ where: { lead: { organizationId, assignedBrokerId: brokerId } } }),
    prisma.deal.count({
      where: {
        lead: { organizationId, assignedBrokerId: brokerId },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  const conversionRate = activeLeads ? (deals / activeLeads) * 100 : 0;
  const firstCallRate = activeLeads ? (firstOutboundByLead.size / activeLeads) * 100 : 0;

  return {
    activeLeads,
    responseTime: formatDuration(avgResponseMs),
    conversionRate: Number(conversionRate.toFixed(1)),
    firstCallRate: Math.round(firstCallRate),
    monthlyClosures
  };
}

async function listBrokers(organizationId) {
  const brokers = await prisma.user.findMany({ where: { organizationId, role: 'BROKER', isActive: true }, select: { id: true, name: true } });
  const items = [];
  for (const b of brokers) {
    const metrics = await brokerMetrics(b.id, organizationId);
    items.push({
      id: b.id,
      name: b.name,
      activeLeads: metrics.activeLeads,
      responseTime: metrics.responseTime,
      conversionRate: `${metrics.conversionRate}%`,
      monthClosures: metrics.monthlyClosures
    });
  }
  return items;
}

async function getBroker(id) {
  return prisma.user.findUnique({ where: { id }, include: { assignedLeads: true } });
}

module.exports = { listBrokers, getBroker, brokerMetrics };
