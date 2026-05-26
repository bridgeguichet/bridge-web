import { config } from "dotenv";
config();

import { db } from "../src/lib/db";
import { users, accounts } from "../src/lib/db/schema";
import { like } from "drizzle-orm";

async function main() {
  console.log("=== CHECK ALL USERS ===");
  const allUsers = await db.select().from(users);
  console.log(`Total users: ${allUsers.length}\n`);

  for (const u of allUsers) {
    console.log(`- ${u.name} (${u.email}): role=${u.role}`);
  }

  console.log("\n=== CHECK MANAGER & OPERATOR ===");
  const manager = await db.select().from(users).where(like(users.email, "%manager%"));
  const operator = await db.select().from(users).where(like(users.email, "%operator%"));

  console.log(`Manager found: ${manager.length}`);
  if (manager.length > 0) console.log(`  - ${manager[0].name} (${manager[0].email})`);

  console.log(`Operator found: ${operator.length}`);
  if (operator.length > 0) console.log(`  - ${operator[0].name} (${operator[0].email})`);

  console.log("\n=== CHECK ACCOUNTS ===");
  const allAccounts = await db.select().from(accounts);
  console.log(`Total accounts: ${allAccounts.length}`);
  for (const a of allAccounts) {
    const u = allUsers.find((user) => user.id === a.userId);
    console.log(`  - ${a.providerId}: ${u?.email || "unknown"}`);
  }

  process.exit(0);
}

main().catch(console.error);
