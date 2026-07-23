import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DB_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Creating Prisma client...");
  console.log(`TURSO_DB_URL set: ${!!tursoUrl}`);
  console.log(`TURSO_AUTH_TOKEN set: ${!!tursoToken}`);
  console.log(`DATABASE_URL: ${(process.env.DATABASE_URL || "not set").substring(0, 50)}`);

  if (tursoUrl) {
    try {
      const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoToken,
        tls: true,
      });
      console.log("Using Turso adapter");
      return new PrismaClient({ adapter });
    } catch (e) {
      console.error("Failed to create Turso adapter:", e);
      throw e;
    }
  }

  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  });
  console.log("Using local SQLite adapter");
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
