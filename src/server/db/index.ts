import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Initialize Redis if configured, otherwise provide a dummy implementation or throw
export const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL) 
  : null;

if (!redis) {
  console.warn("Redis URL not provided. Caching and SSE features might be disabled or run in memory.");
}
