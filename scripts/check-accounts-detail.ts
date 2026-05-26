import { config } from "dotenv";
config();

import { db } from "../src/lib/db";
import { users, accounts } from "../src/lib/db/schema";

async function main() {
  console.log("=== DÉTAIL DES ACCOUNTS ===\n");

  const allAccounts = await db.select().from(accounts);
  const allUsers = await db.select().from(users);

  for (const a of allAccounts) {
    const user = allUsers.find((u) => u.id === a.userId);
    console.log(`Account: ${a.id}`);
    console.log(`  userId: ${a.userId}`);
    console.log(`  accountId: ${a.accountId}`);
    console.log(`  providerId: ${a.providerId}`);
    console.log(`  User: ${user?.name} (${user?.email})`);
    console.log(`  Has password: ${!!a.password}`);
    if (a.password) {
      console.log(`  Password hash: ${a.password.substring(0, 20)}...`);
    }
    console.log("");
  }

  process.exit(0);
}

main().catch(console.error);
