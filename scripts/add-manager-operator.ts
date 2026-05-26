import { config } from "dotenv";
config();

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { users, accounts, vendorMembers, vendors } from "../src/lib/db/schema";

const DEFAULT_PASSWORD = "00000000";
const hashPassword = () => bcrypt.hashSync(DEFAULT_PASSWORD, 10);

const generateId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

async function main() {
  console.log("🔧 Création des users Manager et Operator\n");

  // 1. Trouver le vendor Bridge
  const [bridgeVendor] = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true)).limit(1);

  if (!bridgeVendor) {
    console.log("❌ Vendor Bridge non trouvé!");
    process.exit(1);
  }

  // 2. Créer Manager
  console.log("1. Création du Manager...");
  const managerId = generateId();
  const [managerUser] = await db
    .insert(users)
    .values({
      id: managerId,
      email: "manager@bridge.com",
      name: "BRIDGE Manager",
      emailVerified: true,
      role: "manager",
      phone: "+243000000001",
      isSuperUser: false,
    })
    .returning();

  await db.insert(accounts).values({
    id: generateId(),
    userId: managerUser.id,
    accountId: managerUser.email,
    providerId: "credential",
    password: hashPassword(),
  });

  await db.insert(vendorMembers).values({
    vendorId: bridgeVendor.id,
    userId: managerUser.id,
    role: "manager",
  });

  console.log(`✅ Manager créé: ${managerUser.email} / mot de passe: ${DEFAULT_PASSWORD}`);

  // 3. Créer Operator
  console.log("\n2. Création de l'Operator...");
  const operatorId = generateId();
  const [operatorUser] = await db
    .insert(users)
    .values({
      id: operatorId,
      email: "operator@bridge.com",
      name: "BRIDGE Operator",
      emailVerified: true,
      role: "operator",
      phone: "+243000000002",
      isSuperUser: false,
    })
    .returning();

  await db.insert(accounts).values({
    id: generateId(),
    userId: operatorUser.id,
    accountId: operatorUser.email,
    providerId: "credential",
    password: hashPassword(),
  });

  await db.insert(vendorMembers).values({
    vendorId: bridgeVendor.id,
    userId: operatorUser.id,
    role: "operator",
  });

  console.log(`✅ Operator créé: ${operatorUser.email} / mot de passe: ${DEFAULT_PASSWORD}`);

  // 4. Vérification
  console.log("\n📋 Vérification des membres Bridge:");
  const members = await db.select().from(vendorMembers).where(eq(vendorMembers.vendorId, bridgeVendor.id));

  for (const m of members) {
    const u = await db.select().from(users).where(eq(users.id, m.userId)).limit(1);
    console.log(`  - ${m.role}: ${u[0]?.name} (${u[0]?.email})`);
  }

  console.log("\n🎉 Terminé! La page Membres affichera maintenant:");
  console.log("   - BRIDGE Admin (admin)");
  console.log("   - mohamedmena.mmv (admin, super-user)");
  console.log("   - BRIDGE Manager (manager)");
  console.log("   - BRIDGE Operator (operator)");

  process.exit(0);
}

main().catch(console.error);
