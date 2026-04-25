import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config();

const connectionString = process.env.DATABASE_URL!;

async function reset() {
  console.log("🗑️  Connecting to database...");
  const sql = postgres(connectionString, { max: 1 });

  console.log("🗑️  Dropping all tables...");

  // Drop all tables in correct order (respecting foreign keys)
  const tables = [
    "order_assignments",
    "pack_items",
    "custom_packs",
    "payments",
    "order_items",
    "orders",
    "addresses",
    "service_availability",
    "service_variants",
    "services",
    "resources",
    "subcategories",
    "categories",
    "vendors",
    "account",
    "session",
    "verification",
    '"user"',
    "__drizzle_migrations",
  ];

  for (const table of tables) {
    try {
      await sql.unsafe(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`  ✓ Dropped ${table}`);
    } catch (e) {
      console.log(`  ⚠️  Error dropping ${table}: ${e}`);
    }
  }

  console.log("✅ Database reset complete!");
  await sql.end();
}

reset().catch((err) => {
  console.error("❌ Failed to reset database:", err);
  process.exit(1);
});
