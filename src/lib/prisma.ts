import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const tursoUrl = process.env.TURSO_DB_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  try {
    if (tursoUrl) {
      const { PrismaLibSql } = require("@prisma/adapter-libsql/web");
      const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
      return new PrismaClient({ adapter });
    }
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "file:./prisma/dev.db" });
    return new PrismaClient({ adapter });
  } catch (e: any) {
    console.error("Prisma client init error:", e.message, e.stack);
    throw e;
  }
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
