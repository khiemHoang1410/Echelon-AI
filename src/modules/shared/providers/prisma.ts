import { PrismaClient } from '@prisma/client';

// Khai báo type cho biến global để TypeScript không la làng
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Nếu đã có instance cũ (do hot reload) thì dùng lại, không thì new cái mới
export const db = globalForPrisma.prisma || new PrismaClient();

// Ở môi trường dev, lưu instance vào biến global
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;