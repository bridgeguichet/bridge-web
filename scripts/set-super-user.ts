import { config } from "dotenv";
config();

import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";

const SUPER_USER_EMAIL = "mohamedmena.mmv@gmail.com";

async function main() {
  console.log(`🔍 Recherche de l'utilisateur: ${SUPER_USER_EMAIL}`);

  // Vérifier si l'utilisateur existe
  const existingUser = await db.select().from(users).where(eq(users.email, SUPER_USER_EMAIL)).limit(1);

  if (existingUser.length === 0) {
    console.log("❌ Utilisateur non trouvé. Création d'un nouvel utilisateur...");

    // Créer l'utilisateur s'il n'existe pas
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 32; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    await db.insert(users).values({
      id,
      email: SUPER_USER_EMAIL,
      name: "Mohamed (Dev)",
      emailVerified: true,
      role: "admin",
      isSuperUser: true,
    });

    console.log(`✅ Utilisateur créé avec ID: ${id}`);
    console.log("⚠️  N'oublie pas de définir un mot de passe via 'Forgot password' ou de créer un account credential");
  } else {
    console.log(`✅ Utilisateur trouvé: ${existingUser[0].name} (${existingUser[0].id})`);

    // Mettre à jour en super-user
    await db
      .update(users)
      .set({
        isSuperUser: true,
        role: "admin",
      })
      .where(eq(users.email, SUPER_USER_EMAIL));

    console.log("✅ Utilisateur mis à jour: isSuperUser = true, role = admin");
  }

  // Vérification
  const updatedUser = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isSuperUser: users.isSuperUser,
    })
    .from(users)
    .where(eq(users.email, SUPER_USER_EMAIL))
    .limit(1);

  console.log("\n📋 Résultat:");
  console.table(updatedUser[0]);

  console.log("\n🎉 Tu peux maintenant te connecter avec accès super-user complet !");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
