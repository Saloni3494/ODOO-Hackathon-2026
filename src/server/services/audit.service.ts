import { prisma } from '../db/index';
import { NotFoundError } from '../utils/errors';

export class AuditService {
  static async createAuditCycle(name: string, startDate: Date, endDate: Date, scope?: string) {
    return prisma.auditCycle.create({
      data: {
        name,
        startDate,
        endDate,
        scope,
        status: 'OPEN'
      }
    });
  }

  static async assignAuditor(auditId: string, auditorId: string) {
    return prisma.auditAssignment.create({
      data: { auditId, auditorId }
    });
  }

  static async submitResult(auditId: string, assetId: string, status: string, notes?: string) {
    return prisma.auditResult.create({
      data: {
        auditId,
        assetId,
        status, // VERIFIED, MISSING, DAMAGED
        notes
      }
    });
  }

  static async closeAuditCycle(auditId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.auditCycle.update({
        where: { id: auditId },
        data: { status: 'CLOSED' }
      });

      // Auto flag missing/damaged assets
      const results = await tx.auditResult.findMany({ where: { auditId } });
      for (const res of results) {
        if (res.status === 'MISSING') {
          await tx.asset.update({
            where: { id: res.assetId },
            data: { lifecycleStatus: 'LOST' }
          });
        }
      }
      return { success: true };
    });
  }
}
