import { and, eq, ilike, inArray, lt, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canPerform, getUserVendorRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { categories, pendingActions, serviceVariants, services, vendors } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// Helper function to archive expired services
async function archiveExpiredServices() {
  try {
    const now = new Date();

    // Récupérer tous les services actifs qui sont expirés
    const expiredServices = await db
      .select()
      .from(services)
      .where(and(eq(services.status, "active"), lt(services.expiresAt, now)));

    // Archiver les services expirés
    for (const service of expiredServices) {
      await db
        .update(services)
        .set({
          status: "archived",
          updatedAt: new Date(),
        })
        .where(eq(services.id, service.id));
    }

    return expiredServices.length;
  } catch (error) {
    console.error("Erreur lors de l'archivage automatique des services:", error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/services - starting...");

    // Vérifier et archiver les services expirés (désactivé temporairement pour diagnostic)
    const autoArchive = request.nextUrl.searchParams.get("autoArchive") === "true";
    if (autoArchive) {
      await archiveExpiredServices();
    }

    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "active";

    console.log("GET /api/services - params:", { categoryId, subcategoryId, search, status });

    const conditions = [eq(services.status, status)];

    if (categoryId) conditions.push(eq(services.categoryId, categoryId));
    if (subcategoryId) conditions.push(eq(services.subcategoryId, subcategoryId));
    if (search) {
      conditions.push(
        or(
          ilike(services.nameFr, `%${search}%`),
          ilike(services.nameEn, `%${search}%`),
          ilike(services.descriptionFr, `%${search}%`),
        )!,
      );
    }

    console.log("GET /api/services - querying db...");
    const rows = await db
      .select()
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(and(...conditions));
    console.log("GET /api/services - rows fetched:", rows.length);

    const serviceIds = rows.map((r) => r.services.id);
    const variants =
      serviceIds.length > 0
        ? await db.select().from(serviceVariants).where(inArray(serviceVariants.serviceId, serviceIds))
        : [];
    console.log("GET /api/services - variants fetched:", variants.length);

    const result = rows.map((row) => ({
      ...row.services,
      category: row.categories ?? undefined,
      vendor: row.vendors ?? undefined,
      variants: variants.filter((v) => v.serviceId === row.services.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const {
      vendorId,
      categoryId,
      subcategoryId,
      nameFr,
      nameEn,
      descriptionFr,
      descriptionEn,
      basePrice,
      priceUnit,
      metadata,
      imageUrl,
      expiresAt,
    } = body;

    if (!vendorId || !categoryId || !nameFr || !nameEn || !basePrice || !priceUnit) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Check permission
    const role = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(role, "create", "service")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Additional permission check for temporary services
    if (expiresAt && !canPerform(role, "create", "service")) {
      return NextResponse.json({ error: "Permission refusée pour créer un service temporaire" }, { status: 403 });
    }

    // Validate expiresAt is in the future if provided
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (expiryDate <= new Date()) {
        return NextResponse.json({ error: "La date d'expiration doit être dans le futur" }, { status: 400 });
      }
    }

    const [newService] = await db
      .insert(services)
      .values({
        vendorId,
        categoryId,
        subcategoryId,
        nameFr,
        nameEn,
        descriptionFr,
        descriptionEn,
        basePrice,
        priceUnit,
        metadata,
        imageUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "active",
      })
      .returning();

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
