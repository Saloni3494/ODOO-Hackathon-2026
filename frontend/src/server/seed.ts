import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const roles = ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  
  // 2. Admin User
  if (adminRole) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@assetflow.com' },
      update: {},
      create: {
        name: 'Super Admin',
        email: 'admin@assetflow.com',
        passwordHash,
        roleId: adminRole.id
      }
    });
  }

  // 3. Departments
  const itDept = await prisma.department.upsert({
    where: { name: 'IT Department' },
    update: {},
    create: { name: 'IT Department' }
  });

  // 4. Asset Categories
  const laptopCat = await prisma.assetCategory.upsert({
    where: { name: 'Laptops' },
    update: {},
    create: { name: 'Laptops' }
  });

  // 5. Sample Assets
  for (let i = 1; i <= 5; i++) {
    const tag = `AF-000${i}`;
    await prisma.asset.upsert({
      where: { assetTag: tag },
      update: {},
      create: {
        name: `MacBook Pro 16" - ${i}`,
        assetTag: tag,
        categoryId: laptopCat.id,
        departmentId: itDept.id,
        lifecycleStatus: 'AVAILABLE'
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
