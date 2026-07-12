import { createServerFn } from '@tanstack/react-start';
import { AuthService } from './server/services/auth.service';
import { AssetService } from './server/services/asset.service';
import { AllocationService } from './server/services/allocation.service';
import { BookingService } from './server/services/booking.service';
import { MaintenanceService } from './server/services/maintenance.service';
import { prisma } from './server/db/index';

// Auth Functions
export const loginFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return AuthService.login(data.email, data.password);
  });

export const signupFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return AuthService.signup(data.name, data.email, data.password);
  });

// Dashboard Functions
export const getDashboardStatsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const [available, allocated, maintenance, activeBookings] = await Promise.all([
      prisma.asset.count({ where: { lifecycleStatus: 'AVAILABLE' } }),
      prisma.asset.count({ where: { lifecycleStatus: 'ALLOCATED' } }),
      prisma.maintenanceRequest.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'ONGOING' } }),
    ]);

    return { available, allocated, maintenance, activeBookings };
  });

// Asset Functions
export const registerAssetFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    // Ideally we extract userId from session middleware here, using hardcoded for now
    return AssetService.registerAsset(data, 'SYSTEM_OR_ADMIN_ID');
  });

export const listAssetsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return AssetService.listAssets();
  });

export const listCategoriesFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return prisma.assetCategory.findMany();
  });

// Allocation & Transfer Functions
export const listUsersFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return prisma.user.findMany({ select: { id: true, name: true, email: true } });
  });

export const allocateAssetFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return AllocationService.allocateAsset(data.assetId, data.userId, data.expectedReturnDate);
  });

export const requestTransferFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    // Basic implementation for transfer request
    return prisma.transferRequest.create({
      data: {
        assetId: data.assetId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        approvalDetails: data.reason
      }
    });
  });

export const returnAssetFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return AllocationService.returnAsset(data.assetId, data.conditionNotes);
  });

// Booking Functions
export const listBookableAssetsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return prisma.asset.findMany({ where: { isBookable: true } });
  });

export const getAssetBookingsFn = createServerFn({ method: 'GET' })
  .validator((data: { assetId: string }) => data)
  .handler(async ({ data }) => {
    return prisma.booking.findMany({
      where: { assetId: data.assetId },
      include: { user: { select: { name: true } } }
    });
  });

export const bookResourceFn = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return BookingService.createBooking(data.assetId, data.userId, new Date(data.startTime), new Date(data.endTime));
  });

// Maintenance Functions
export const listMaintenanceRequestsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return prisma.maintenanceRequest.findMany({
      include: { asset: { select: { assetTag: true, name: true } } }
    });
  });

export const updateMaintenanceStageFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string, stage: any }) => data)
  .handler(async ({ data }) => {
    if (data.stage === 'RESOLVED') {
      return MaintenanceService.resolveRequest(data.id, "System", "Resolved via Dashboard");
    }
    return prisma.maintenanceRequest.update({
      where: { id: data.id },
      data: { status: data.stage }
    });
  });

// Audit Functions
export const listAuditCyclesFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return prisma.auditCycle.findMany({
      include: { results: { include: { asset: true } } }
    });
  });

export const closeAuditCycleFn = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.auditCycle.update({
      where: { id: data.id },
      data: { status: 'CLOSED' }
    });
  });
