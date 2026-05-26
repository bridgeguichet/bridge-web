import { config } from "dotenv";
config();

import { eq, and } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, vendors, vendorMembers } from "../src/lib/db/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const DEFAULT_PASSWORD = "00000000";

// Users à créer avec leurs champs additionnels
const USERS = [
  {
    email: "rootuser@bridge.com",
    name: "ROOT User",
    role: "customer",
    isSuperUser: true,
  },
  {
    email: "admin@bridge-guichet.com",
    name: "BRIDGE Admin",
    role: "admin",
    isSuperUser: false,
  },
  {
    email: "manager@bridge.com",
    name: "BRIDGE Manager",
    role: "manager",
    isSuperUser: false,
  },
  {
    email: "operator@bridge.com",
    name: "BRIDGE Operator",
    role: "operator",
    isSuperUser: false,
  },
];

async function createUserViaAPI(user: (typeof USERS)[0]) {
  console.log(`\n👤 Création: ${user.name} (${user.email})`);

  const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: API_URL,
    },
    body: JSON.stringify({
      email: user.email,
      password: DEFAULT_PASSWORD,
      name: user.name,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.error?.message?.includes("already exists")) {
      console.log("   ⚠️  Déjà existant");
      return { id: null, email: user.email, exists: true };
    }
    console.log(`   ❌ Erreur: ${data.error?.message}`);
    return { id: null, email: user.email, exists: false };
  }

  console.log(`   ✅ User créé: ${data.user?.id}`);
  return { id: data.user?.id, email: user.email, exists: false };
}

async function main() {
  console.log("🌱 Seed avec Better Auth API\n");

  // 1. Créer les users via l'API Better Auth
  const createdUsers = [];
  for (const user of USERS) {
    const result = await createUserViaAPI(user);
    createdUsers.push({ ...result, ...user });
  }

  // 2. Mettre à jour les champs additionnels (role, isSuperUser) en DB via Drizzle
  console.log("\n📝 Mise à jour des champs additionnels...");

  for (const user of createdUsers) {
    await db
      .update(users)
      .set({
        role: user.role as any,
        isSuperUser: user.isSuperUser,
      })
      .where(eq(users.email, user.email));
    console.log(`   ✅ ${user.email}: role=${user.role}, super=${user.isSuperUser}`);
  }

  // 3. Créer le vendor Bridge et les vendor_members pour l'équipe (sauf rootuser)
  console.log("\n🏢 Création du vendor BRIDGE...");

  const adminUser = await db.select().from(users).where(eq(users.email, "admin@bridge-guichet.com")).limit(1);
  if (adminUser.length === 0) {
    console.log("❌ Admin non trouvé!");
    process.exit(1);
  }

  // Créer ou récupérer le vendor
  const existingVendor = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true));
  let vendorId;

  if (existingVendor.length > 0) {
    vendorId = existingVendor[0].id;
    console.log(`   ℹ️  Vendor existe déjà: ${vendorId}`);
  } else {
    const [newVendor] = await db
      .insert(vendors)
      .values({
        userId: adminUser[0].id,
        companyName: "BRIDGE Guichet",
        status: "active",
        isBridgeOfficial: true,
        commissionRate: "0",
        description: "Service officiel BRIDGE pour la diaspora congolaise",
      })
      .returning();
    vendorId = newVendor.id;
    console.log(`   ✅ Vendor créé: ${vendorId}`);
  }

  // Créer les vendor_members (sauf pour rootuser)
  console.log("\n👥 Création des vendor_members...");

  for (const user of createdUsers) {
    if (user.role === "customer" && user.isSuperUser) {
      console.log(`   ⏭️  ${user.email} (rootuser) - pas de vendor_member`);
      continue;
    }

    const userRecord = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
    if (userRecord.length === 0) continue;

    // Vérifier si déjà membre
    const existing = await db
      .select()
      .from(vendorMembers)
      .where(and(eq(vendorMembers.vendorId, vendorId), eq(vendorMembers.userId, userRecord[0].id)));

    if (existing.length > 0) {
      console.log(`   ℹ️  ${user.email} déjà membre`);
    } else {
      await db.insert(vendorMembers).values({
        vendorId: vendorId,
        userId: userRecord[0].id,
        role: user.role as any,
      });
      console.log(`   ✅ ${user.email} ajouté comme ${user.role}`);
    }
  }

  console.log("\n🎉 Seed terminé avec succès!");
  console.log("\n📋 Comptes créés:");
  for (const u of USERS) {
    console.log(`   - ${u.email} (${u.name}) - role: ${u.role}, super: ${u.isSuperUser}`);
  }
  console.log(`\n🔑 Mot de passe pour tous: ${DEFAULT_PASSWORD}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
