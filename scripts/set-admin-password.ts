import { config } from "dotenv";
import postgres from "postgres";
import { scryptSync, randomBytes } from "node:crypto";

config();

const connectionString = process.env.DATABASE_URL!;

async function setAdminPassword() {
  const sql = postgres(connectionString, { max: 1 });

  // Trouver l'admin
  const [admin] = await sql`
    SELECT id FROM "user" WHERE email = 'admin@bridge-guichet.com'
  `;

  if (!admin) {
    console.log("❌ Admin non trouvé");
    process.exit(1);
  }

  console.log("✅ Admin trouvé:", admin.id);

  // Hacher avec N=4096 (2^12) - léger mais sécurisé
  const salt = randomBytes(16);
  const derivedKey = scryptSync("test@1234", salt, 32, {
    N: 4096,
    r: 8,
    p: 1,
    maxmem: 33554432, // 32MB
  });
  const hashedPassword = `$scrypt$N=4096,r=8,p=1$${salt.toString("base64")}$${derivedKey.toString("base64")}`;

  // Mettre à jour le mot de passe
  await sql`
    UPDATE account 
    SET password = ${hashedPassword}
    WHERE "userId" = ${admin.id}
    AND "providerId" = 'credential'
  `;

  console.log("✅ Mot de passe défini: test@1234");
  console.log("ℹ️  Hash: N=4096,r=8,p=1");
  await sql.end();
}

setAdminPassword().catch(console.error);
