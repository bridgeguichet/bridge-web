import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function fixImageColumns() {
  console.log("Checking and fixing image_url columns...");

  try {
    // Add image_url to categories if not exists
    console.log("Adding image_url to categories...");
    await db.execute(sql`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS image_url varchar(500)
    `);
    console.log("✓ categories.image_url added or already exists");

    // Add image_url to service_variants if not exists
    console.log("Adding image_url to service_variants...");
    await db.execute(sql`
      ALTER TABLE service_variants 
      ADD COLUMN IF NOT EXISTS image_url varchar(500)
    `);
    console.log("✓ service_variants.image_url added or already exists");

    // Verify image_url exists in services (should already exist)
    console.log("Checking services.image_url...");
    await db.execute(sql`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS image_url varchar(500)
    `);
    console.log("✓ services.image_url added or already exists");

    console.log("\nAll image_url columns are ready!");
  } catch (error) {
    console.error("Error fixing image columns:", error);
    process.exit(1);
  }

  process.exit(0);
}

fixImageColumns();
