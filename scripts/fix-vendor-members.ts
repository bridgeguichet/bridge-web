import { config } from "dotenv";
config();

import { eq, ne, and } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, vendorMembers, vendors } from "../src/lib/db/schema";

const DEFAULT_PASSWORD = "00000000";

async function main() {
  console.log("🔧 Fix: Ajout des vendor_members manquants\n");

  // 1. Trouver le vendor Bridge
  const [bridgeVendor] = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true)).limit(1);

  if (!bridgeVendor) {
    console.log("❌ Vendor Bridge non trouvé!");
    process.exit(1);
  }
  console.log(`✅ Vendor Bridge: ${bridgeVendor.companyName} (${bridgeVendor.id})\n`);

  // 2. Trouver les utilisateurs staff (non-customer)
  const staffUsers = await db.select().from(users).where(ne(users.role, "customer"));

  console.log(`👥 Utilisateurs staff trouvés: ${staffUsers.length}\n`);

  // 3. Pour chaque staff user, vérifier s'il est déjà vendor_member
  for (const user of staffUsers) {
    // Mapping des rôles
    const roleMap: Record<string, string> = {
      admin: "admin",
      manager: "manager",
      operator: "operator",
      staff: "operator",
    };
    const vendorRole = roleMap[user.role] || "operator";

    // Vérifier si déjà membre
    const existing = await db
      .select()
      .from(vendorMembers)
      .where(and(eq(vendorMembers.vendorId, bridgeVendor.id), eq(vendorMembers.userId, user.id)))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⏭️  Déjà membre: ${user.name} (${user.email}) - ${vendorRole}`);
      continue;
    }

    // Créer le vendor_member
    await db.insert(vendorMembers).values({
      vendorId: bridgeVendor.id,
      userId: user.id,
      role: vendorRole,
    });

    console.log(`✅ Ajouté: ${user.name} (${user.email}) - ${vendorRole}`);
  }

  // 4. Vérification finale
  console.log("\n📋 Vérification finale:");
  const allMembers = await db.select().from(vendorMembers).where(eq(vendorMembers.vendorId, bridgeVendor.id));

  console.log(`Total membres Bridge: ${allMembers.length}`);
  for (const m of allMembers) {
    const u = await db.select().from(users).where(eq(users.id, m.userId)).limit(1);
    console.log(`  - ${m.role}: ${u[0]?.name} (${u[0]?.email})`);
  }

  console.log("\n🎉 Terminé! La page Membres devrait maintenant afficher les membres.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
