import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Bật cái này để tí nữa seed nó hiện log cho sướng mắt
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
