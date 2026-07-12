import { prisma } from '../db/index';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import QRCode from 'qrcode';

export class AssetService {
  /**
   * Register a new asset and generate its QR code.
   */
  static async registerAsset(data: any, createdBy: string) {
    // Generate an asset tag e.g. AF-XXXX
    const count = await prisma.asset.count();
    const assetTag = `AF-${String(count + 1).padStart(4, '0')}`;

    // Generate QR Code data URL
    const qrData = JSON.stringify({ assetTag });
    let qrCodeUrl = null;
    try {
      qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      logger.warn('Failed to generate QR code for asset');
    }

    const asset = await prisma.asset.create({
      data: {
        ...data,
        assetTag,
        qrCodeUrl,
        createdBy
      }
    });

    await prisma.activityLog.create({
      data: {
        who: createdBy,
        what: 'REGISTER_ASSET',
        entity: 'ASSET',
        newValue: asset as any
      }
    });

    return asset;
  }

  /**
   * Update Asset Lifecycle Status with Validation (State Machine)
   */
  static async updateStatus(assetId: string, newStatus: string, updatedBy: string) {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundError('Asset not found');

    const current = asset.lifecycleStatus;
    
    // State machine logic
    const validTransitions: Record<string, string[]> = {
      AVAILABLE: ['ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'RETIRED', 'DISPOSED', 'LOST'],
      ALLOCATED: ['AVAILABLE', 'LOST'], // Must be returned to be available
      RESERVED: ['AVAILABLE', 'ALLOCATED', 'LOST'],
      UNDER_MAINTENANCE: ['AVAILABLE', 'RETIRED', 'DISPOSED', 'LOST'],
      LOST: ['AVAILABLE', 'RETIRED'],
      RETIRED: [],
      DISPOSED: []
    };

    if (!validTransitions[current]?.includes(newStatus)) {
      throw new ConflictError(`Invalid state transition from ${current} to ${newStatus}`);
    }

    const updated = await prisma.asset.update({
      where: { id: assetId },
      data: { 
        lifecycleStatus: newStatus as any,
        updatedBy,
        version: { increment: 1 }
      }
    });

    await prisma.assetHistory.create({
      data: {
        assetId,
        changedBy: updatedBy,
        changeType: 'STATUS_CHANGE',
        oldValue: { status: current },
        newValue: { status: newStatus }
      }
    });

    return updated;
  }

  /**
   * Get all assets with optional filtering
   */
  static async listAssets(filters: any = {}) {
    return prisma.asset.findMany({
      where: filters,
      include: {
        category: true,
        department: true
      }
    });
  }

  static async getAssetByTag(assetTag: string) {
    const asset = await prisma.asset.findUnique({ 
      where: { assetTag },
      include: {
        history: { orderBy: { createdAt: 'desc' }, take: 10 },
        allocations: { orderBy: { createdAt: 'desc' }, take: 10 },
        maintenanceReqs: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });
    if (!asset) throw new NotFoundError('Asset not found');
    return asset;
  }
}
