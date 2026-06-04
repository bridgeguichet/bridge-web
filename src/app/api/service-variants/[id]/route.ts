import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { canDelete, canPerform, getUserVendorRole, requiresPendingApproval } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema/services";
import { users, pendingActions, services } from "@/lib/db/schema";
import { getCascadeTargets, notifyValidatorsForValidation } from "@/lib/notifications/validation";

async function isAdmin(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.role === "admin";
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    console.log(`[PUT /api/service-variants/${id}] Received body:`, body);
    console.log(`[PUT /api/service-variants/${id}] imageUrl:`, body.imageUrl);

    const [variant] = await db.update(serviceVariants).set(body).where(eq(serviceVariants.id, id)).returning();

    console.log(`[PUT /api/service-variants/${id}] Updated variant:`, variant);

    if (!variant) {
      return NextResponse.json({ error: "Variante non trouvée" }, { status: 404 });
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error updating service variant:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la variante" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing variant
    const existingVariant = await db.select().from(serviceVariants).where(eq(serviceVariants.id, id)).limit(1);
    if (existingVariant.length === 0) {
      return NextResponse.json({ error: "Variante non trouvée" }, { status: 404 });
    }

    const variant = existingVariant[0];

    // Get the service to check vendor permissions
    const service = await db.select().from(services).where(eq(services.id, variant.serviceId)).limit(1);
    if (service.length === 0) {
      return NextResponse.json({ error: "Service associé non trouvé" }, { status: 404 });
    }

    // Check permission
    const role = await getUserVendorRole(session.user.id, service[0].vendorId);
    if (!canDelete(role, "variant")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Check if deletion requires pending approval (manager or operator role)
    if (requiresPendingApproval(role, "delete", "variant")) {
      // Create pending action instead of deleting
      const [pendingAction] = await db
        .insert(pendingActions)
        .values({
          vendorId: service[0].vendorId,
          requestedBy: session.user.id,
          actionType: "delete",
          targetType: "variant",
          targetId: id,
          targetName: variant.nameFr || variant.nameEn || `Variante ${id}`,
          status: "pending",
        })
        .returning();

      // Notifier les admins et managers pour validation
      await notifyValidatorsForValidation(service[0].vendorId, pendingAction);

      return NextResponse.json(
        {
          message: "Demande de suppression soumise pour validation",
          pendingAction,
        },
        { status: 202 },
      );
    }

    // Admin can delete directly
    const [deleted] = await db.delete(serviceVariants).where(eq(serviceVariants.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Variante non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Variante supprimée" });
  } catch (error) {
    console.error("Error deleting service variant:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la variante" }, { status: 500 });
  }
}
