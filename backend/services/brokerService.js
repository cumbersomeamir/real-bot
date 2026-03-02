const prisma = require('../config/database');

async function listBrokers(organizationId) {
  const brokers = await prisma.user.findMany({
    where: { organizationId, role: 'BROKER' },
    include: { assignedLeads: true }
  });

  return brokers.map((broker) => ({
    id: broker.id,
    name: broker.name,
    activeLeads: broker.assignedLeads.length,
    responseTime: '4m 12s',
    conversionRate: '12.5%',
    monthClosures: Math.floor(Math.random() * 10)
  }));
}

async function getBroker(id) {
  return prisma.user.findUnique({ where: { id }, include: { assignedLeads: true } });
}

module.exports = { listBrokers, getBroker };
