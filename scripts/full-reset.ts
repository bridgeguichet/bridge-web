import { config } from "dotenv";
config();

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  console.log("⚠️  FULL RESET - Suppression complète de toutes les tables et migrations\n");

  const sql = postgres(DATABASE_URL!, { max: 1 });

  // Drop drizzle schema
  console.log("🗑️  Suppression du schéma drizzle...");
  await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;

  // Get all tables
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `;

  console.log("🗑️  Suppression des tables:");
  for (const t of tables) {
    console.log(`   - ${t.table_name}`);
    await sql.unsafe(`DROP TABLE IF EXISTS "${t.table_name}" CASCADE`);
  }

  console.log("\n✅ Base de données complètement vidée");
  await sql.end();

  // Re-run everything
  console.log("\n🔄 Exécution des migrations...");
  const { execSync } = require("child_process");
  execSync("npm run db:migrate", { stdio: "inherit", cwd: process.cwd() });

  console.log("\n🌱 Exécution du seed...");
  execSync("npm run db:seed", { stdio: "inherit", cwd: process.cwd() });

  console.log("\n🎉 Reset complet terminé!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
