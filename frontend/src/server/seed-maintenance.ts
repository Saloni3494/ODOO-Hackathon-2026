import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding maintenance records quickly...');

  // Get first user and some assets
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No users found");

  const assets = await prisma.asset.findMany({ take: 5 });
  if (assets.length === 0) throw new Error("No assets found");

  const stages = ["PENDING", "APPROVED", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"];
  
  const requests = [];
  for (let i = 0; i < assets.length; i++) {
    if (i >= stages.length) break;
    
    requests.push({
      assetId: assets[i].id,
      reportedById: user.id,
      issue: `Hardware fault reported: #00${i}`,
      priority: 'HIGH',
      status: stages[i] as any,
    });
  }

  await prisma.maintenanceRequest.createMany({
    data: requests
  });

  console.log('Maintenance seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
