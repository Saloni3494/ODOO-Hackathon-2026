import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding audit cycle quickly...');

  const assets = await prisma.asset.findMany({ take: 5 });
  if (assets.length === 0) throw new Error("No assets found");

  const cycle = await prisma.auditCycle.create({
    data: {
      name: 'Q3 Asset Audit - Engineering',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'OPEN'
    }
  });

  const statuses = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'MISSING', 'DAMAGED'];
  
  const results = assets.map((asset, index) => ({
    auditId: cycle.id,
    assetId: asset.id,
    status: statuses[index % statuses.length],
    notes: index === 3 ? 'Could not locate in main office' : (index === 4 ? 'Screen cracked' : null)
  }));

  await prisma.auditResult.createMany({
    data: results
  });

  console.log('Audit cycle seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
