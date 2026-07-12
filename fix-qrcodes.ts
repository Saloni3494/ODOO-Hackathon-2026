import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
const prisma = new PrismaClient();
async function main() {
  const assets = await prisma.asset.findMany({ where: { qrCodeUrl: null } });
  console.log('Found ' + assets.length + ' assets missing QR codes.');
  for (const asset of assets) {
    const qrData = JSON.stringify({ assetTag: asset.assetTag });
    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      await prisma.asset.update({ where: { id: asset.id }, data: { qrCodeUrl } });
      console.log('Updated QR code for ' + asset.assetTag);
    } catch (e) {
      console.error('Failed for ' + asset.assetTag, e);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
