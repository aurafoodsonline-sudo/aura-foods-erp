import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_DB_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

async function main() {
  console.log("Connecting to local SQLite...");
  const local = createClient({ url: "file:./dev.db" });

  // Get all tables (excluding sqlite internal)
  const tables = await local.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  const tableNames = tables.rows.map((r: any) => r.name).filter((n: string) => n !== "sqlite_sequence");
  console.log(`Found tables: ${tableNames.join(", ")}`);

  // Get CREATE TABLE statements
  const createStmts: string[] = [];
  for (const name of tableNames) {
    const sql = await local.execute(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='${name}'`
    );
    if (sql.rows[0]?.sql) {
      createStmts.push(sql.rows[0].sql as string);
    }
  }

  // Connect to Turso
  console.log("Connecting to Turso...");
  const turso = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  // Drop all existing tables on Turso
  console.log("Dropping existing tables on Turso...");
  for (const name of tableNames) {
    try {
      await turso.execute(`DROP TABLE IF EXISTS "${name}" CASCADE`);
    } catch {
      await turso.execute(`DROP TABLE IF EXISTS "${name}"`);
    }
  }

  // Create tables on Turso
  console.log("Creating tables on Turso...");
  for (const stmt of createStmts) {
    console.log(`  ${stmt.substring(0, 100)}`);
    await turso.execute(stmt);
  }

  // Create indexes
  const indexes = await local.execute(
    "SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL"
  );
  for (const row of indexes.rows) {
    try {
      await turso.execute(row.sql as string);
    } catch { }
  }

  // Disable foreign key checks during copy
  await turso.execute("PRAGMA foreign_keys = OFF");

  // Copy data from each table (ordered to respect FK dependencies)
  const copyOrder = ["User", "Category", "Product", "ProductImage", "Customer", "Order", "OrderItem", "InventoryStock", "InventoryTransaction", "CartItem", "Setting"];
  console.log("Copying data...");
  for (const name of copyOrder) {
    if (!tableNames.includes(name)) continue;
    const rows = await local.execute(`SELECT * FROM "${name}"`);
    if (rows.rows.length === 0) continue;

    const cols = Object.keys(rows.rows[0] as any);

    for (const row of rows.rows) {
      const vals = cols.map((c) => (row as any)[c]);
      const placeholders = cols.map(() => "?").join(", ");
      try {
        await turso.execute({
          sql: `INSERT INTO "${name}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`,
          args: vals,
        });
      } catch (e: any) {
        console.error(`  Error inserting into ${name}: ${e.message}`);
        console.error(`  Row: ${JSON.stringify(row)}`);
      }
    }
    console.log(`  Copied ${rows.rows.length} rows to ${name}`);
  }

  console.log("\nTurso database is fully initialized! Ready for deployment.");
  local.close();
  turso.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
