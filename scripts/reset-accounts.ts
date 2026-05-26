import { config } from "dotenv";
config();

import { db } from "../src/lib/db";
import { accounts } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

import bcrypt from "bcrypt";

const DEFAULT_PASSWORD = "00000000";

// Better Auth compatible hash using native bcrypt
async function createBetterAuthHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🔧 Réinitialisation des accounts avec hash compatible\n");

  // Supprimer tous les accounts existants
  console.log("🗑️  Suppression des accounts existants...");
  await db.delete(accounts);
  console.log("✅ Accounts supprimés\n");

  // Récupérer tous les users
  const { users } = await import("../src/lib/db/schema");
  const allUsers = await db.select().from(users);

  console.log(`👥 ${allUsers.length} users trouvés\n`);

  // Créer de nouveaux accounts avec hash compatible
  for (const user of allUsers) {
    const passwordHash = await createBetterAuthHash(DEFAULT_PASSWORD);

    await db.insert(accounts).values({
      id: generateId(),
      userId: user.id,
      accountId: user.email,
      providerId: "credential",
      password: passwordHash,
    });

    console.log(`✅ Account créé: ${user.email}`);
    console.log(`   Hash: ${passwordHash.substring(0, 30)}...`);
  }

  console.log("\n🎉 Terminé!");
  console.log(`Mot de passe pour tous: ${DEFAULT_PASSWORD}`);
  process.exit(0);
}

function generateId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

main().catch(console.error);
