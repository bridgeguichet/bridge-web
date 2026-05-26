import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canDelete, canPerform, getUserVendorRole, requiresPendingApproval } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { categories, pendingActions, serviceVariants, services, vendors } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(eq(services.id, id));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const row = rows[0];
    const variants = await db.select().from(serviceVariants).where(eq(serviceVariants.serviceId, id));

    return NextResponse.json({
      ...row.services,
      category: row.categories ?? undefined,
      vendor: row.vendors ?? undefined,
      variants,
    });
  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get existing service
    const existingService = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existingService.length === 0) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const service = existingService[0];

    // Check permission
    const role = await getUserVendorRole(user.id, service.vendorId);
    if (!canPerform(role, "update", "service")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    const { nameFr, nameEn, descriptionFr, descriptionEn, basePrice, priceUnit, metadata, imageUrl, status } = body;

    const [updatedService] = await db
      .update(services)
      .set({
        nameFr,
        nameEn,
        descriptionFr,
        descriptionEn,
        basePrice,
        priceUnit,
        metadata,
        imageUrl,
        status,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("PUT /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing service
    const existingService = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existingService.length === 0) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const service = existingService[0];

    // Check permission
    const role = await getUserVendorRole(user.id, service.vendorId);
    if (!canDelete(role, "service")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Check if deletion requires pending approval (manager role)
    if (requiresPendingApproval(role, "delete", "service")) {
      // Create pending action instead of deleting
      const [pendingAction] = await db
        .insert(pendingActions)
        .values({
          vendorId: service.vendorId,
          requestedBy: user.id,
          actionType: "delete",
          targetType: "service",
          targetId: id,
          targetName: service.nameFr,
          status: "pending",
        })
        .returning();

      return NextResponse.json(
        {
          message: "Demande de suppression soumise pour validation admin",
          pendingAction,
        },
        { status: 202 },
      );
    }

    // Admin can delete directly
    await db.delete(services).where(eq(services.id, id));

    return NextResponse.json({ message: "Service supprimé" });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
