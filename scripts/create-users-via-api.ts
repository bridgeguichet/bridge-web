import { config } from "dotenv";
config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const DEFAULT_PASSWORD = "00000000";

const users = [
  { email: "rootuser@bridge.com", name: "ROOT User", role: "customer", isSuperUser: true },
  { email: "admin@bridge-guichet.com", name: "BRIDGE Admin", role: "admin", isSuperUser: false },
  { email: "manager@bridge.com", name: "BRIDGE Manager", role: "manager", isSuperUser: false },
  { email: "operator@bridge.com", name: "BRIDGE Operator", role: "operator", isSuperUser: false },
];

async function createUser(user: (typeof users)[0]) {
  console.log(`\n👤 Création: ${user.name} (${user.email})`);

  try {
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

    if (res.ok) {
      console.log(`   ✅ Créé avec succès`);
      return data.user?.id;
    } else if (data.error?.message?.includes("already exists")) {
      console.log(`   ⚠️  Déjà existant`);
      return null;
    } else {
      console.log(`   ❌ Erreur: ${data.error?.message || JSON.stringify(data)}`);
      return null;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err}`);
    return null;
  }
}

async function main() {
  console.log("🌱 Création des users via Better Auth API\n");
  console.log(`URL: ${API_URL}`);
  console.log(`Mot de passe par défaut: ${DEFAULT_PASSWORD}\n`);

  // Vérifier que le serveur répond
  try {
    const health = await fetch(`${API_URL}/api/auth/get-session`);
    console.log(`✅ Serveur accessible (status: ${health.status})\n`);
  } catch (err) {
    console.log(`❌ Serveur inaccessible: ${err}`);
    console.log("   Assure-toi que 'npm run dev' tourne sur le port 3000");
    process.exit(1);
  }

  for (const user of users) {
    await createUser(user);
  }

  console.log("\n✅ Terminé !");
  process.exit(0);
}

main();
