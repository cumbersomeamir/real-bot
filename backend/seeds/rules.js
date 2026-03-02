async function seedRules(prisma, organizationId) {
  const rules = [];
  for (let i = 1; i <= 10; i += 1) {
    const rule = await prisma.automationRule.create({
      data: {
        name: `Rule ${i}`,
        description: `Automation rule ${i}`,
        organizationId,
        conditions: [{ field: 'score', op: 'gte', value: 70 + (i % 10) }],
        actions: [{ type: 'assign_broker' }, { type: 'send_template' }],
        isActive: true,
        priority: i
      }
    });
    rules.push(rule);
  }
  return rules;
}

module.exports = { seedRules };
