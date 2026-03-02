async function seedProjects(prisma, organizationId) {
  const projects = [
    {
      name: 'Skyline Residences',
      location: 'Baner Road',
      city: 'Pune',
      type: 'RESIDENTIAL',
      totalUnits: 220,
      availableUnits: 84,
      priceRange: { min: 6500000, max: 14500000, unit: 'total' },
      configurations: ['2BHK', '3BHK'],
      amenities: ['Clubhouse', 'Pool', 'Gym'],
      images: [],
      organizationId
    },
    {
      name: 'Marina Heights',
      location: 'Powai',
      city: 'Mumbai',
      type: 'RESIDENTIAL',
      totalUnits: 180,
      availableUnits: 52,
      priceRange: { min: 12500000, max: 28000000, unit: 'total' },
      configurations: ['2BHK', '3BHK', '4BHK'],
      amenities: ['Sky Deck', 'Co-working', 'Spa'],
      images: [],
      organizationId
    },
    {
      name: 'TechPark Business Square',
      location: 'Whitefield',
      city: 'Bengaluru',
      type: 'COMMERCIAL',
      totalUnits: 90,
      availableUnits: 27,
      priceRange: { min: 18000000, max: 56000000, unit: 'total' },
      configurations: ['Office Suite', 'Retail'],
      amenities: ['Business Lounge', 'Parking', 'Security'],
      images: [],
      organizationId
    }
  ];

  const created = [];
  for (const project of projects) {
    const item = await prisma.project.create({ data: project });
    created.push(item);

    for (let i = 1; i <= 20; i += 1) {
      await prisma.inventory.create({
        data: {
          unitNumber: `${project.city.slice(0, 2).toUpperCase()}-${i}`,
          floor: i,
          type: project.configurations[0],
          area: 750 + i * 10,
          price: project.priceRange.min + i * 100000,
          projectId: item.id,
          status: i % 7 === 0 ? 'BOOKED' : 'AVAILABLE'
        }
      });
    }
  }

  return created;
}

module.exports = { seedProjects };
