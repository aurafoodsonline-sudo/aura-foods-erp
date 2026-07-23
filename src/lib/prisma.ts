import { PrismaClient } from "@prisma/client";

const tursoUrl = process.env.TURSO_DB_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let AdapterClass: any;
if (tursoUrl) {
  // Use web variant for remote connections (no native binary needed)
  AdapterClass = require("@prisma/adapter-libsql/web").PrismaLibSql;
} else {
  AdapterClass = require("@prisma/adapter-libsql").PrismaLibSql;
}

const adapter = new AdapterClass({
  url: tursoUrl || process.env.DATABASE_URL || "file:./prisma/dev.db",
  ...(tursoToken ? { authToken: tursoToken } : {}),
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
