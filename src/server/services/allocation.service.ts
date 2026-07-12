import { prisma } from '../db/index';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { AssetService } from './asset.service';

export class AllocationService {
  /**
   * Allocate an asset to a user or department
   * Uses Prisma $transaction to prevent race conditions.
   */
  static async allocateAsset(assetId: string, userId: string, expectedReturnDate?: Date) {
    return prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id: assetId } });
      if (!asset) throw new NotFoundError('Asset not found');

      if (asset.lifecycleStatus !== 'AVAILABLE') {
        throw new ConflictError(`Asset is not available. Currently: ${asset.lifecycleStatus}`);
      }

      // Update asset status
      await tx.asset.update({
        where: { id: assetId },
        data: { 
          lifecycleStatus: 'ALLOCATED',
          currentHolderId: userId
        }
      });

      // Create allocation record
      const allocation = await tx.allocation.create({
        data: {
          assetId,
          userId,
          expectedReturnDate
        }
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          who: userId,
          what: 'ALLOCATED_ASSET',
          entity: 'ALLOCATION',
          newValue: allocation as any
        }
      });

      return allocation;
    });
  }

  /**
   * Return an allocated asset
   */
  static async returnAsset(allocationId: string, userId: string, conditionNotes?: string) {
    return prisma.$transaction(async (tx) => {
      const allocation = await tx.allocation.findUnique({ where: { id: allocationId } });
      if (!allocation || allocation.status === 'RETURNED') {
        throw new ConflictError('Allocation not found or already returned');
      }

      await tx.allocation.update({
        where: { id: allocationId },
        data: { 
          status: 'RETURNED', 
          returnedAt: new Date(),
          conditionNotes 
        }
      });

      await tx.asset.update({
        where: { id: allocation.assetId },
        data: { 
          lifecycleStatus: 'AVAILABLE',
          currentHolderId: null
        }
      });

      return { success: true };
    });
  }

  /**
   * Request a transfer from current holder to a new user
   */
  static async requestTransfer(assetId: string, fromUserId: string, toUserId: string) {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset || asset.currentHolderId !== fromUserId) {
      throw new ConflictError('Asset is not held by the requesting user');
    }

    return prisma.transferRequest.create({
      data: {
        assetId,
        fromUserId,
        toUserId
      }
    });
  }
}
