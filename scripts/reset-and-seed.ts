import { config } from "dotenv";
config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  console.log("⚠️  RESET DATABASE - Toutes les données seront supprimées!\n");

  // Connect with postgres-js for raw SQL
  const sql = postgres(DATABASE_URL!, { max: 1 });

  // Get all tables
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `;

  console.log("🗑️  Suppression des tables:");
  for (const t of tables) {
    const tableName = t.table_name;
    // Skip drizzle migrations table
    if (tableName === "__drizzle_migrations") continue;

    console.log(`   - ${tableName}`);
    await sql.unsafe(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
  }

  console.log("\n✅ Tables supprimées");
  await sql.end();

  console.log("\n🔄 Réexécution des migrations...");
  // Re-run migrations
  const { execSync } = require("child_process");
  execSync("npm run db:migrate", { stdio: "inherit", cwd: process.cwd() });

  console.log("\n🌱 Réexécution du seed...");
  execSync("npm run db:seed", { stdio: "inherit", cwd: process.cwd() });

  console.log("\n🎉 Base de données resetée et re-seedée avec succès!");
  console.log("\n📋 Comptes créés:");
  console.log("   - rootuser@bridge.com (super-user, pas membre) - password: 00000000");
  console.log("   - admin@bridge-guichet.com (admin) - password: 00000000");
  console.log("   - manager@bridge.com (manager) - password: 00000000");
  console.log("   - operator@bridge.com (operator) - password: 00000000");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
