const { PrismaLibSql } = require("@prisma/adapter-libsql/web");
const { PrismaClient } = require("@prisma/client");

const tursoUrl = process.env.TURSO_DB_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

console.log("TURSO_DB_URL:", tursoUrl ? "set" : "not set");
console.log("TURSO_AUTH_TOKEN:", tursoToken ? "set" : "not set");

const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: tursoToken,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany({ take: 3 });
  console.log(`Found ${categories.length} categories:`);
  categories.forEach((c: any) => console.log(`  - ${c.name} (${c.slug})`));
  await prisma.$disconnect();
}

main().catch((e: any) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
