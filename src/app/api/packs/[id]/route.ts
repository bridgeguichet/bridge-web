import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { categories, customPacks, packItems, services, serviceVariants } from "@/lib/db/schema";

// GET /api/packs/[id] - Détails d'un pack avec items enrichis
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const isDev = process.env.NODE_ENV === "development";

    const [pack] = await db.select().from(customPacks).where(eq(customPacks.id, id));

    if (!pack) {
      return NextResponse.json({ error: "Pack non trouvé" }, { status: 404 });
    }

    // En développement, permettre l'accès sans auth
    if (!isDev && !session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier autorisation (sauf en dev ou pour packs temporaires)
    if (session && pack.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Récupérer items avec détails
    const items = await db
      .select({
        item: packItems,
        service: services,
        variant: serviceVariants,
        category: categories,
      })
      .from(packItems)
      .leftJoin(services, eq(packItems.serviceId, services.id))
      .leftJoin(serviceVariants, eq(packItems.variantId, serviceVariants.id))
      .leftJoin(categories, eq(packItems.categoryId, categories.id))
      .where(eq(packItems.packId, id));

    const enrichedItems = items.map((row) => ({
      ...row.item,
      service: row.service,
      variant: row.variant,
      category: row.category,
    }));

    return NextResponse.json({ ...pack, items: enrichedItems });
  } catch (error) {
    console.error("Error fetching pack:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération du pack" }, { status: 500 });
  }
}
