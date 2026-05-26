import { config } from "dotenv";
config();

import { db } from "../src/lib/db";
import {
  users,
  accounts,
  vendorMembers,
  vendors,
  services,
  serviceVariants,
  categories,
  subcategories,
  resources,
} from "../src/lib/db/schema";

async function main() {
  console.log("🧹 Nettoyage complet de la base de données\n");

  // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
  await db.delete(serviceVariants);
  console.log("✅ service_variants supprimés");

  await db.delete(services);
  console.log("✅ services supprimés");

  await db.delete(subcategories);
  console.log("✅ subcategories supprimés");

  await db.delete(categories);
  console.log("✅ categories supprimés");

  await db.delete(resources);
  console.log("✅ resources supprimés");

  await db.delete(vendorMembers);
  console.log("✅ vendor_members supprimés");

  await db.delete(vendors);
  console.log("✅ vendors supprimés");

  await db.delete(accounts);
  console.log("✅ accounts supprimés");

  await db.delete(users);
  console.log("✅ users supprimés");

  console.log("\n🎉 Base nettoyée!");
  process.exit(0);
}

main().catch(console.error);
