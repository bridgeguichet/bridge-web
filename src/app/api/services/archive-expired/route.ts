import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, lt, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { checkIsSuperUser } from "@/lib/auth/permissions";

/**
 * API endpoint pour archiver manuellement les services expirés
 * Accessible uniquement aux super utilisateurs ou via cron job
 */
export async function POST() {
  try {
    // Vérifier l'authentification pour les appels manuels
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      const isSuper = await checkIsSuperUser(session.user.id);
      if (!isSuper) {
        return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
      }
    }

    const now = new Date();

    // Récupérer tous les services actifs qui sont expirés
    const expiredServices = await db
      .select()
      .from(services)
      .where(and(eq(services.status, "active"), lt(services.expiresAt, now)));

    if (expiredServices.length === 0) {
      return NextResponse.json({
        message: "Aucun service expiré trouvé",
        archivedCount: 0,
      });
    }

    // Archiver les services expirés
    const archivedServices = [];
    for (const service of expiredServices) {
      await db
        .update(services)
        .set({
          status: "archived",
          updatedAt: new Date(),
        })
        .where(eq(services.id, service.id));

      archivedServices.push({
        id: service.id,
        name: service.nameFr,
        expiredAt: service.expiresAt,
      });
    }

    return NextResponse.json({
      message: `${archivedServices.length} service(s) archivé(s) avec succès`,
      archivedCount: archivedServices.length,
      archivedServices,
    });
  } catch (error) {
    console.error("Erreur lors de l'archivage des services expirés:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
