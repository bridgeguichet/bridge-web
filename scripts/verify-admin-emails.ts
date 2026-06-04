import { config } from "dotenv";
config();

import { eq, like } from "drizzle-orm";
import { db } from "../src/lib/db";
import { users, verifications } from "../src/lib/db/schema";

const TARGET_EMAILS = [
  "admin@bridge-guichet.com",
  "manager@bridge.com",
  "operator@bridge.com",
];

async function main() {
  console.log("🔧 Vérification des emails administratifs\n");

  let verifiedCount = 0;
  let alreadyVerifiedCount = 0;
  let notFoundCount = 0;

  for (const email of TARGET_EMAILS) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      console.log(`⚠️  ${email}: Utilisateur non trouvé`);
      notFoundCount++;
      continue;
    }

    if (user.emailVerified) {
      console.log(`✅ ${email}: Déjà vérifié`);
      alreadyVerifiedCount++;
      continue;
    }

    await db.update(users).set({ emailVerified: true }).where(eq(users.id, user.id));
    console.log(`🔓 ${email}: Email vérifié avec succès`);
    verifiedCount++;
  }

  console.log("\n📊 Résumé:");
  console.log(`   - Emails vérifiés: ${verifiedCount}`);
  console.log(`   - Déjà vérifiés: ${alreadyVerifiedCount}`);
  console.log(`   - Non trouvés: ${notFoundCount}`);

  const totalTokens = await db.select().from(verifications);
  if (totalTokens.length > 0) {
    console.log(`\n🧹 ${totalTokens.length} token(s) de vérification enregistré(s)`);
    for (const token of totalTokens) {
      const isTargetEmail = TARGET_EMAILS.some((e) => token.identifier.includes(e));
      if (isTargetEmail) {
        console.log(`   - Token pour ${token.identifier} (expire: ${token.expiresAt})`);
      }
    }
  }

  console.log("\n🎉 Terminé!");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Erreur:", error);
  process.exit(1);
});
