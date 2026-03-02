const bcrypt = require('bcryptjs');

async function seedUsers(prisma, organizationId) {
  const password = await bcrypt.hash('Password@123', 12);

  const users = [
    {
      email: 'owner@dealflow.ai',
      name: 'Owner User',
      password,
      role: 'OWNER',
      organizationId,
      phone: '+919800000001'
    },
    {
      email: 'director@dealflow.ai',
      name: 'Sales Director',
      password,
      role: 'SALES_DIRECTOR',
      organizationId,
      phone: '+919800000002'
    },
    {
      email: 'manager@dealflow.ai',
      name: 'Sales Manager',
      password,
      role: 'SALES_MANAGER',
      organizationId,
      phone: '+919800000003'
    },
    {
      email: 'broker1@dealflow.ai',
      name: 'Broker One',
      password,
      role: 'BROKER',
      organizationId,
      phone: '+919800000004'
    },
    {
      email: 'broker2@dealflow.ai',
      name: 'Broker Two',
      password,
      role: 'BROKER',
      organizationId,
      phone: '+919800000005'
    }
  ];

  const created = [];
  for (const user of users) {
    const item = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
    created.push(item);
  }

  return created;
}

module.exports = { seedUsers };
