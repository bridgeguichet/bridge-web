import { db } from "../src/lib/db";
import { services } from "../src/lib/db/schema";
import { eq, lt, and } from "drizzle-orm";

/**
 * Script pour archiver automatiquement les services expirés
 * Ce script peut être exécuté via un cron job ou manuellement
 */
async function archiveExpiredServices() {
  try {
    console.log("Début de l'archivage des services expirés...");

    const now = new Date();

    // Récupérer tous les services actifs qui sont expirés
    const expiredServices = await db
      .select()
      .from(services)
      .where(and(eq(services.status, "active"), lt(services.expiresAt, now)));

    if (expiredServices.length === 0) {
      console.log("Aucun service expiré trouvé.");
      return;
    }

    console.log(`Trouvé ${expiredServices.length} service(s) expiré(s)`);

    // Archiver les services expirés
    for (const service of expiredServices) {
      await db
        .update(services)
        .set({
          status: "archived",
          updatedAt: new Date(),
        })
        .where(eq(services.id, service.id));

      console.log(`Service "${service.nameFr}" (ID: ${service.id}) archivé.`);
    }

    console.log("Archivage des services expirés terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'archivage des services expirés:", error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  archiveExpiredServices()
    .then(() => {
      console.log("Script terminé avec succès.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erreur lors de l'exécution du script:", error);
      process.exit(1);
    });
}

export { archiveExpiredServices };
