import { config } from "dotenv";
config();

import { eq, and } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, accounts, vendorMembers } from "../src/lib/db/schema";

const OLD_EMAIL = "mohamedmena.mmv@gmail.com";
const NEW_EMAIL = "rootuser@bridge.com";

async function main() {
  console.log("🔧 Mise à jour du compte root\n");

  // 1. Trouver l'utilisateur
  const [user] = await db.select().from(users).where(eq(users.email, OLD_EMAIL)).limit(1);

  if (!user) {
    console.log(`❌ Utilisateur ${OLD_EMAIL} non trouvé!`);
    process.exit(1);
  }

  console.log(`✅ Utilisateur trouvé: ${user.name} (${user.id})`);
  console.log(`   Role actuel: ${user.role}, SuperUser: ${user.isSuperUser}`);

  // 2. Changer l'email
  console.log(`\n📧 Changement d'email: ${OLD_EMAIL} → ${NEW_EMAIL}`);
  await db.update(users).set({ email: NEW_EMAIL }).where(eq(users.id, user.id));

  // 3. Mettre à jour le nom pour refléter le nouveau statut
  await db.update(users).set({ name: "ROOT User" }).where(eq(users.id, user.id));

  // 4. Changer le role à "customer" (pour ne pas apparaître dans les listes staff)
  // mais garder isSuperUser: true pour tous les accès
  console.log(`\n👤 Changement de role: admin → customer (mais super-user)`);
  await db
    .update(users)
    .set({
      role: "customer", // Ne pas apparaître comme staff
      isSuperUser: true, // Mais garder tous les accès
    })
    .where(eq(users.id, user.id));

  // 5. Mettre à jour l'account (email)
  console.log("🔐 Mise à jour de l'account...");
  await db.update(accounts).set({ accountId: NEW_EMAIL }).where(eq(accounts.userId, user.id));

  // 6. Supprimer de vendor_members (pour ne pas apparaître dans la liste des membres)
  console.log("🗑️  Suppression de la liste des membres Bridge...");
  await db.delete(vendorMembers).where(eq(vendorMembers.userId, user.id));

  // 7. Vérification
  console.log("\n📋 Vérification:");
  const updated = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  console.log(`   Email: ${updated[0].email}`);
  console.log(`   Name: ${updated[0].name}`);
  console.log(`   Role: ${updated[0].role}`);
  console.log(`   isSuperUser: ${updated[0].isSuperUser}`);

  // 8. Vérifier les membres Bridge restants
  console.log("\n👥 Membres Bridge restants (sans toi):");
  const remaining = await db.select().from(vendorMembers);

  for (const m of remaining) {
    const u = await db.select().from(users).where(eq(users.id, m.userId)).limit(1);
    console.log(`   - ${m.role}: ${u[0]?.name} (${u[0]?.email})`);
  }

  console.log("\n🎉 Terminé!");
  console.log("\nTu peux maintenant te connecter avec:");
  console.log(`   Email: ${NEW_EMAIL}`);
  console.log(`   (Ton mot de passe reste inchangé)`);
  console.log("\nTu as accès à tout mais n'apparais pas dans la liste des membres.");

  process.exit(0);
}

main().catch(console.error);
