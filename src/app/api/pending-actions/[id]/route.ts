import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canPerform, getUserVendorRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { pendingActions, services, categories, resources, vendorMembers } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// Helper to execute the actual deletion based on target type
async function executeDeletion(targetType: string, targetId: string) {
  switch (targetType) {
    case "service":
      await db.delete(services).where(eq(services.id, targetId));
      break;
    case "category":
      await db.delete(categories).where(eq(categories.id, targetId));
      break;
    case "resource":
      await db.delete(resources).where(eq(resources.id, targetId));
      break;
    case "member":
      await db.delete(vendorMembers).where(eq(vendorMembers.id, targetId));
      break;
    default:
      throw new Error(`Type de cible non supporté: ${targetType}`);
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
    const { status: newStatus, reason } = body;

    if (!newStatus || !["approved", "rejected"].includes(newStatus)) {
      return NextResponse.json({ error: "Statut invalide (approved ou rejected)" }, { status: 400 });
    }

    // Get existing pending action
    const existingAction = await db.select().from(pendingActions).where(eq(pendingActions.id, id)).limit(1);
    if (existingAction.length === 0) {
      return NextResponse.json({ error: "Action en attente introuvable" }, { status: 404 });
    }

    const action = existingAction[0];

    // Only admin can approve/reject
    const role = await getUserVendorRole(user.id, action.vendorId);
    if (!canPerform(role, "update", "pending_action")) {
      return NextResponse.json({ error: "Permission refusée - Admin requis" }, { status: 403 });
    }

    // Check if action is still pending
    if (action.status !== "pending") {
      return NextResponse.json({ error: "Cette action a déjà été traitée" }, { status: 409 });
    }

    // If approved, execute the actual action
    if (newStatus === "approved") {
      try {
        await executeDeletion(action.targetType, action.targetId);
      } catch (error) {
        console.error("Error executing deletion:", error);
        return NextResponse.json({ error: "Erreur lors de l'exécution de la suppression" }, { status: 500 });
      }
    }

    // Update pending action status
    const [updatedAction] = await db
      .update(pendingActions)
      .set({
        status: newStatus,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        reason: reason || action.reason,
      })
      .where(eq(pendingActions.id, id))
      .returning();

    return NextResponse.json({
      message: newStatus === "approved" ? "Action approuvée et exécutée" : "Action rejetée",
      action: updatedAction,
    });
  } catch (error) {
    console.error("PUT /api/pending-actions/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
