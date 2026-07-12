import { prisma } from '../db/index';
import { NotFoundError, ConflictError } from '../utils/errors';
import { AssetService } from './asset.service';

export class MaintenanceService {
  /**
   * Raise a new maintenance request
   */
  static async createRequest(assetId: string, reportedById: string, issue: string, priority: string = 'MEDIUM') {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundError('Asset not found');

    return prisma.maintenanceRequest.create({
      data: {
        assetId,
        reportedById,
        issue,
        priority,
        status: 'PENDING'
      }
    });
  }

  /**
   * Update request status (workflow)
   */
  static async updateStatus(requestId: string, status: string, approvalById?: string, technicianId?: string) {
    const req = await prisma.maintenanceRequest.findUnique({ where: { id: requestId } });
    if (!req) throw new NotFoundError('Maintenance request not found');

    const dataToUpdate: any = { status };
    if (status === 'APPROVED' && approvalById) {
      dataToUpdate.approvedAt = new Date();
      dataToUpdate.approvalById = approvalById;
      // Auto update asset status to UNDER_MAINTENANCE
      await AssetService.updateStatus(req.assetId, 'UNDER_MAINTENANCE', approvalById);
    }
    
    if (status === 'TECHNICIAN_ASSIGNED' && technicianId) {
      dataToUpdate.technicianId = technicianId;
    }
    
    if (status === 'RESOLVED') {
      dataToUpdate.resolvedAt = new Date();
      // Revert asset to available
      await AssetService.updateStatus(req.assetId, 'AVAILABLE', 'SYSTEM');
    }

    return prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: dataToUpdate
    });
  }
}
