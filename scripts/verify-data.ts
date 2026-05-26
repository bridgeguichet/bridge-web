import { config } from "dotenv";
config();

import { db } from "../src/lib/db";
import { users, accounts, vendorMembers, vendors } from "../src/lib/db/schema";

async function main() {
  console.log("=== VÉRIFICATION DES DONNÉES ===\n");

  // 1. Vérifier les users
  console.log("1. TABLE users:");
  const allUsers = await db.select().from(users);
  console.log(`   Total: ${allUsers.length} users`);
  for (const u of allUsers) {
    console.log(`   - ${u.name} (${u.email}): role=${u.role}, super=${u.isSuperUser}`);
  }

  // 2. Vérifier les accounts
  console.log("\n2. TABLE accounts:");
  const allAccounts = await db.select().from(accounts);
  console.log(`   Total: ${allAccounts.length} accounts`);
  for (const a of allAccounts) {
    const user = allUsers.find((u) => u.id === a.userId);
    console.log(`   - ${a.providerId}: ${user?.email || "UNKNOWN"} (userId=${a.userId.substring(0, 8)}...)`);
  }

  // 3. Vérifier les vendors
  console.log("\n3. TABLE vendors:");
  const allVendors = await db.select().from(vendors);
  console.log(`   Total: ${allVendors.length} vendors`);
  for (const v of allVendors) {
    console.log(`   - ${v.companyName}: id=${v.id.substring(0, 8)}..., Bridge=${v.isBridgeOfficial}`);
  }

  // 4. Vérifier les vendor_members
  console.log("\n4. TABLE vendor_members:");
  const allMembers = await db.select().from(vendorMembers);
  console.log(`   Total: ${allMembers.length} members`);
  for (const m of allMembers) {
    const user = allUsers.find((u) => u.id === m.userId);
    const vendor = allVendors.find((v) => v.id === m.vendorId);
    console.log(`   - ${user?.name || "UNKNOWN"}: role=${m.role}, vendor=${vendor?.companyName || "UNKNOWN"}`);
  }

  // 5. Vérifier spécifiquement rootuser
  console.log("\n5. VÉRIFICATION ROOTUSER:");
  const rootUser = allUsers.find((u) => u.email === "rootuser@bridge.com");
  if (rootUser) {
    console.log(`   ✅ User trouvé: ${rootUser.id}`);
    const rootAccount = allAccounts.find((a) => a.userId === rootUser.id);
    if (rootAccount) {
      console.log(`   ✅ Account trouvé: ${rootAccount.id}`);
      console.log(`   ✅ Provider: ${rootAccount.providerId}`);
      console.log(`   ✅ Has password: ${!!rootAccount.password}`);
    } else {
      console.log(`   ❌ Account NON trouvé!`);
    }
  } else {
    console.log(`   ❌ User rootuser@bridge.com NON trouvé!`);
  }

  console.log("\n=== FIN VÉRIFICATION ===");
  process.exit(0);
}

main().catch(console.error);
