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
  const sql = postgres(DATABASE_URL!, { max: 1 });

  console.log("📋 Tables existantes:\n");

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;

  if (tables.length === 0) {
    console.log("❌ Aucune table trouvée!");
  } else {
    for (const t of tables) {
      console.log(`   - ${t.table_name}`);
    }
  }

  await sql.end();
  process.exit(0);
}

main().catch(console.error);
