import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient | undefined;
};
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
