import { config } from "dotenv";
config();

import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, vendorMembers, vendors } from "../src/lib/db/schema";

async function main() {
  console.log("🔍 Debug: Vendor Members\n");

  // 1. Vérifier le vendor Bridge
  console.log("1. Vendors (isBridgeOfficial=true):");
  const bridgeVendors = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true));
  console.table(bridgeVendors);

  if (bridgeVendors.length === 0) {
    console.log("❌ Aucun vendor Bridge trouvé !");
    process.exit(1);
  }

  const bridgeVendorId = bridgeVendors[0].id;
  console.log(`\n✅ Bridge Vendor ID: ${bridgeVendorId}\n`);

  // 2. Vérifier les vendor_members pour ce vendor
  console.log("2. Vendor Members pour Bridge:");
  const members = await db.select().from(vendorMembers).where(eq(vendorMembers.vendorId, bridgeVendorId));
  console.table(members);

  if (members.length === 0) {
    console.log("❌ Aucun membre trouvé pour le vendor Bridge !");
  }

  // 3. Vérifier les utilisateurs associés
  console.log("\n3. Détails des utilisateurs:");
  for (const member of members) {
    const user = await db
      .select({ id: users.id, email: users.email, name: users.name, role: users.role })
      .from(users)
      .where(eq(users.id, member.userId))
      .limit(1);
    console.log(`  - ${member.role}: ${user[0]?.name || "N/A"} (${user[0]?.email || "N/A"})`);
  }

  // 4. Vérifier le super-user
  console.log("\n4. Super-user check:");
  const superUsers = await db
    .select({ id: users.id, email: users.email, name: users.name, isSuperUser: users.isSuperUser })
    .from(users)
    .where(eq(users.isSuperUser, true));
  console.table(superUsers);

  console.log("\n✅ Debug terminé");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
