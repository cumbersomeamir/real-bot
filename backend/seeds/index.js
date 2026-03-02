const prisma = require('../config/database');
const { seedUsers } = require('./users');
const { seedProjects } = require('./projects');
const { seedLeads } = require('./demoLeads');
const { seedRules } = require('./rules');

async function main() {
  await prisma.agentLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.siteVisit.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.whatsAppTemplate.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: 'DealFlow Demo Developers',
      domain: 'dealflow.ai',
      plan: 'GROWTH',
      settings: {
        timezone: 'Asia/Kolkata',
        currency: 'INR'
      }
    }
  });

  const users = await seedUsers(prisma, organization.id);
  const projects = await seedProjects(prisma, organization.id);
  const leads = await seedLeads(prisma, organization.id, users, projects);
  await seedRules(prisma, organization.id);

  for (let i = 0; i < 5; i += 1) {
    await prisma.campaign.create({
      data: {
        name: `Campaign ${i + 1}`,
        platform: i % 2 === 0 ? 'meta' : 'google',
        projectId: projects[i % projects.length].id,
        adSpend: 250000 + i * 100000,
        status: 'active'
      }
    });
  }

  for (let i = 0; i < 100; i += 1) {
    const lead = leads[i % leads.length];
    await prisma.communication.create({
      data: {
        leadId: lead.id,
        channel: i % 3 === 0 ? 'WHATSAPP' : i % 3 === 1 ? 'SMS' : 'EMAIL',
        direction: i % 4 === 0 ? 'INBOUND' : 'OUTBOUND',
        content: `Seed communication message ${i + 1}`,
        status: i % 5 === 0 ? 'FAILED' : 'DELIVERED',
        isAIGenerated: i % 2 === 0
      }
    });
  }

  for (let i = 0; i < 20; i += 1) {
    const lead = leads[i % leads.length];
    await prisma.activity.create({
      data: {
        type: i % 2 === 0 ? 'status_change' : 'call',
        description: `Seed activity ${i + 1}`,
        leadId: lead.id,
        userId: users[i % users.length].id
      }
    });
  }

  for (let i = 0; i < 3; i += 1) {
    const lead = leads[i];
    await prisma.deal.create({
      data: {
        leadId: lead.id,
        projectId: projects[i % projects.length].id,
        unitNumber: `A-${i + 1}`,
        dealValue: 9500000 + i * 1500000,
        status: i === 2 ? 'BOOKING_DONE' : 'NEGOTIATION'
      }
    });
  }

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
