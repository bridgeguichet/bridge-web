import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { canDelete, canPerform, getUserVendorRole, requiresPendingApproval } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { categories, pendingActions, services } from "@/lib/db/schema";
import { getCascadeTargets, notifyValidatorsForValidation } from "@/lib/notifications/validation";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const [category] = await db.update(categories).set(body).where(eq(categories.id, id)).returning();

    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la catégorie" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing category
    const existingCategory = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (existingCategory.length === 0) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    const category = existingCategory[0];

    // Get vendorId from services using this category
    const servicesInCategory = await db.select().from(services).where(eq(services.categoryId, id)).limit(1);
    if (servicesInCategory.length === 0) {
      return NextResponse.json({ error: "Catégorie non liée à un vendor" }, { status: 400 });
    }

    const vendorId = servicesInCategory[0].vendorId;

    // Check permission
    const role = await getUserVendorRole(session.user.id, vendorId);
    if (!canDelete(role, "category")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Check if deletion requires pending approval (manager or operator role)
    if (requiresPendingApproval(role, "delete", "category")) {
      // Gérer les suppressions en cascade si nécessaire
      const cascadeTargets = await getCascadeTargets("category", id);
      
      // Create pending action instead of deleting
      const [pendingAction] = await db
        .insert(pendingActions)
        .values({
          vendorId: vendorId,
          requestedBy: session.user.id,
          actionType: "delete",
          targetType: "category",
          targetId: id,
          targetName: category.nameFr,
          status: "pending",
          reason: cascadeTargets.length > 0 ? `Suppression en cascade: ${cascadeTargets.length} services concernés` : undefined,
        })
        .returning();

      // Notifier les admins et managers pour validation
      await notifyValidatorsForValidation(vendorId, pendingAction);

      return NextResponse.json(
        {
          message: "Demande de suppression soumise pour validation",
          pendingAction,
          cascadeTargets,
        },
        { status: 202 },
      );
    }

    // Admin can delete directly
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Catégorie supprimée" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la catégorie" }, { status: 500 });
  }
}
