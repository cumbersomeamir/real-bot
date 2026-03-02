const sources = ['META_ADS', 'GOOGLE_ADS', 'WEBSITE_FORM', 'INDIAMART', 'WHATSAPP_INBOUND', 'MANUAL'];
const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'HOT', 'WARM', 'COLD', 'NEGOTIATION', 'CLOSED_WON', 'DEAD'];

async function seedLeads(prisma, organizationId, users, projects) {
  const brokers = users.filter((u) => u.role === 'BROKER');
  const leads = [];

  for (let i = 1; i <= 50; i += 1) {
    const project = projects[i % projects.length];
    const broker = brokers[i % brokers.length];
    const status = statuses[i % statuses.length];
    const score = Math.min(99, 20 + i);

    const lead = await prisma.lead.create({
      data: {
        name: `Lead ${i}`,
        phone: `+9199${String(10000000 + i).slice(-8)}`,
        email: `lead${i}@example.com`,
        source: sources[i % sources.length],
        status,
        score,
        scoreBreakdown: { budget: 20 + (i % 10), urgency: 15 + (i % 8), engagement: 10 + (i % 12) },
        projectId: project.id,
        organizationId,
        assignedBrokerId: broker.id,
        isQualified: ['QUALIFIED', 'HOT', 'WARM'].includes(status),
        createdById: users[2].id,
        tags: ['demo', status.toLowerCase()],
        notes: 'Seeded lead record'
      }
    });

    leads.push(lead);
  }

  return leads;
}

module.exports = { seedLeads };
