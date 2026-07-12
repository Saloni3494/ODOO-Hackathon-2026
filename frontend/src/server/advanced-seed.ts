import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting advanced database seed...');

  // 1. Roles & Admin
  const roles = ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'];
  for (const roleName of roles) {
    await prisma.role.upsert({ where: { name: roleName }, update: {}, create: { name: roleName } });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const employeeRole = await prisma.role.findUnique({ where: { name: 'EMPLOYEE' } });
  
  if (!adminRole || !employeeRole) throw new Error("Roles missing");

  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetflow.com' },
    update: {},
    create: { name: 'Super Admin', email: 'admin@assetflow.com', passwordHash, roleId: adminRole.id }
  });

  // 2. Departments
  const deptNames = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Procurement', 'Legal', 'IT Support', 'R&D'];
  const depts = [];
  for (const name of deptNames) {
    const dept = await prisma.department.upsert({ where: { name }, update: {}, create: { name } });
    depts.push(dept);
  }

  // 3. Employees
  const employees = [];
  for (let i = 1; i <= 50; i++) {
    const dept = depts[i % depts.length];
    const user = await prisma.user.upsert({
      where: { email: `employee${i}@company.com` },
      update: {},
      create: {
        name: `Employee ${i}`,
        email: `employee${i}@company.com`,
        passwordHash,
        roleId: employeeRole.id,
        departmentId: dept.id
      }
    });
    employees.push(user);
  }

  // 4. Asset Categories
  const categories = ['Laptops', 'Monitors', 'Vehicles', 'Office Furniture', 'Projectors', 'Conference Rooms', 'Testing Devices'];
  const cats = [];
  for (const name of categories) {
    const c = await prisma.assetCategory.upsert({ where: { name }, update: {}, create: { name } });
    cats.push(c);
  }

  // 5. Assets (150 total)
  const assets = [];
  console.log('Generating 150 assets...');
  for (let i = 1; i <= 150; i++) {
    const cat = cats[i % cats.length];
    const dept = depts[i % depts.length];
    const isBookable = cat.name === 'Conference Rooms' || cat.name === 'Projectors';
    const name = `${cat.name.slice(0, -1)} Model ${Math.floor(Math.random() * 100)}`;
    
    const asset = await prisma.asset.upsert({
      where: { assetTag: `AF-${1000 + i}` },
      update: {},
      create: {
        name,
        assetTag: `AF-${1000 + i}`,
        categoryId: cat.id,
        departmentId: dept.id,
        isBookable,
        location: `Building A, Floor ${Math.floor(Math.random() * 5) + 1}`,
        lifecycleStatus: 'AVAILABLE'
      }
    });
    assets.push(asset);
  }

  // 6. Allocations
  console.log('Generating allocations...');
  for (let i = 0; i < 30; i++) {
    const asset = assets[i];
    const user = employees[i];
    if (!asset.isBookable) {
      await prisma.allocation.create({
        data: {
          assetId: asset.id,
          userId: user.id,
          status: 'ACTIVE'
        }
      });
      await prisma.asset.update({ where: { id: asset.id }, data: { lifecycleStatus: 'ALLOCATED' } });
    }
  }

  // 7. Bookings
  console.log('Generating bookings...');
  const bookableAssets = assets.filter(a => a.isBookable);
  for (let i = 0; i < 20; i++) {
    const asset = bookableAssets[i % bookableAssets.length];
    const user = employees[i % employees.length];
    
    // Create booking for today
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9 + (i % 8), 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later
    
    await prisma.booking.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        startTime: start,
        endTime: end,
        status: 'UPCOMING'
      }
    });
  }

  // 8. Maintenance Requests
  console.log('Generating maintenance requests...');
  const maintenanceStages = ["PENDING", "APPROVED", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"];
  for (let i = 0; i < 12; i++) {
    const asset = assets[50 + i]; // Pick some middle assets
    const user = employees[i];
    const stage = maintenanceStages[i % maintenanceStages.length] as any;
    
    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset.id,
        reportedById: user.id,
        issue: `Screen flickering issue #${i}`,
        priority: i % 2 === 0 ? 'HIGH' : 'MEDIUM',
        status: stage,
        technicianId: stage !== 'PENDING' && stage !== 'APPROVED' ? admin.id : null
      }
    });
    await prisma.asset.update({ where: { id: asset.id }, data: { lifecycleStatus: 'UNDER_MAINTENANCE' } });
  }

  // 9. Audit Cycle
  console.log('Generating audit cycle...');
  const cycle = await prisma.auditCycle.create({
    data: {
      name: 'Q3 Asset Audit - Engineering',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'OPEN'
    }
  });

  for (let i = 0; i < 10; i++) {
    const asset = assets[i];
    const statuses = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'MISSING', 'DAMAGED'];
    await prisma.auditResult.create({
      data: {
        auditId: cycle.id,
        assetId: asset.id,
        status: statuses[i % statuses.length],
        notes: i % 4 === 0 ? 'Found in wrong department' : null
      }
    });
  }

  console.log('✨ Advanced seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
