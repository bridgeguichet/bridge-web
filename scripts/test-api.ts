import { config } from "dotenv";
config();

import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { vendorMembers, users } from "../src/lib/db/schema";

const VENDOR_ID = "dadd1d1e-166a-4b71-9834-8e2016229e4f";

async function main() {
  console.log("Test API vendor-members\n");
  console.log("Vendor ID:", VENDOR_ID);

  // Test the query directly
  const members = await db
    .select({
      member: vendorMembers,
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
      },
    })
    .from(vendorMembers)
    .innerJoin(users, eq(vendorMembers.userId, users.id))
    .where(eq(vendorMembers.vendorId, VENDOR_ID));

  console.log("\nRésultat:", members);
  console.log("Count:", members.length);

  process.exit(0);
}

main().catch(console.error);
