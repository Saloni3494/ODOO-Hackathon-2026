import { prisma } from '../db/index';
import { NotFoundError, ConflictError } from '../utils/errors';

export class BookingService {
  /**
   * Book an asset (resource) with overlap validation
   */
  static async createBooking(assetId: string, userId: string, startTime: Date, endTime: Date) {
    return prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id: assetId } });
      if (!asset || !asset.isBookable) {
        throw new ConflictError('Asset is not available for booking');
      }

      // Overlap Validation
      const overlapping = await tx.booking.findFirst({
        where: {
          assetId,
          status: { in: ['UPCOMING', 'ONGOING'] },
          OR: [
            { startTime: { lt: endTime }, endTime: { gt: startTime } } // standard overlap check
          ]
        }
      });

      if (overlapping) {
        throw new ConflictError('Time slot overlaps with an existing booking');
      }

      const booking = await tx.booking.create({
        data: {
          assetId,
          userId,
          startTime,
          endTime,
          status: 'UPCOMING'
        }
      });

      return booking;
    });
  }

  static async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundError('Booking not found');
    
    if (booking.userId !== userId) {
      throw new ConflictError('Cannot cancel another user\'s booking');
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });
  }
}
