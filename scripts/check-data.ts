import { config } from "dotenv";
config();

import { eq, ne } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, vendorMembers, vendors } from "../src/lib/db/schema";

async function main() {
  console.log("=== CHECK VENDORS ===");
  const allVendors = await db.select().from(vendors);
  console.log(`Total vendors: ${allVendors.length}`);
  allVendors.forEach((v) => {
    console.log(`- ${v.companyName} (ID: ${v.id}, Bridge: ${v.isBridgeOfficial})`);
  });

  console.log("\n=== CHECK ALL VENDOR MEMBERS ===");
  const allMembers = await db.select().from(vendorMembers);
  console.log(`Total vendor_members: ${allMembers.length}`);
  allMembers.forEach((m) => {
    console.log(`- vendorId: ${m.vendorId}, userId: ${m.userId}, role: ${m.role}`);
  });

  console.log("\n=== CHECK STAFF USERS ===");
  const staffUsers = await db.select().from(users).where(ne(users.role, "customer"));
  console.log(`Total staff users: ${staffUsers.length}`);
  staffUsers.forEach((u) => {
    console.log(`- ${u.name} (${u.email}): role=${u.role}, super=${u.isSuperUser}`);
  });

  console.log("\n=== CHECK BRIDGE VENDOR MEMBERS ===");
  const bridgeVendor = allVendors.find((v) => v.isBridgeOfficial);
  if (bridgeVendor) {
    const bridgeMembers = await db.select().from(vendorMembers).where(eq(vendorMembers.vendorId, bridgeVendor.id));
    console.log(`Bridge vendor ID: ${bridgeVendor.id}`);
    console.log(`Members count: ${bridgeMembers.length}`);
    bridgeMembers.forEach((m) => {
      console.log(`  - ${m.role}: userId=${m.userId}`);
    });
  } else {
    console.log("❌ No Bridge vendor found!");
  }

  process.exit(0);
}

main().catch(console.error);
