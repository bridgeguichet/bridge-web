import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canDelete, canPerform, getUserVendorRole, requiresPendingApproval } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { resources, pendingActions } from "@/lib/db/schema";
import { notifyValidatorsForValidation } from "@/lib/notifications/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const conditions = [];
    if (type) conditions.push(eq(resources.type, type));
    if (status) conditions.push(eq(resources.status, status));

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(resources)
            .where(and(...conditions))
            .orderBy(resources.createdAt)
        : await db.select().from(resources).orderBy(resources.createdAt);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorId, type, name, status, metadata } = body;

    if (!vendorId || !type || !name) {
      return NextResponse.json({ error: "vendorId, type et name sont requis" }, { status: 400 });
    }

    const [created] = await db
      .insert(resources)
      .values({
        vendorId,
        type,
        name,
        status: status ?? "available",
        metadata: metadata ?? null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/resources error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    const { vendorId, type, name, status, metadata } = fields;

    const [updated] = await db
      .update(resources)
      .set({
        ...(vendorId !== undefined && { vendorId }),
        ...(type !== undefined && { type }),
        ...(name !== undefined && { name }),
        ...(status !== undefined && { status }),
        ...(metadata !== undefined && { metadata }),
        updatedAt: new Date(),
      })
      .where(eq(resources.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/resources error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    // Get existing resource
    const existingResource = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
    if (existingResource.length === 0) {
      return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
    }

    const resource = existingResource[0];

    // Check permission
    const role = await getUserVendorRole(session.user.id, resource.vendorId);
    if (!canDelete(role, "resource")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Check if deletion requires pending approval (manager or operator role)
    if (requiresPendingApproval(role, "delete", "resource")) {
      // Create pending action instead of deleting
      const [pendingAction] = await db
        .insert(pendingActions)
        .values({
          vendorId: resource.vendorId,
          requestedBy: session.user.id,
          actionType: "delete",
          targetType: "resource",
          targetId: id,
          targetName: resource.name,
          status: "pending",
        })
        .returning();

      // Notifier les admins et managers pour validation
      await notifyValidatorsForValidation(resource.vendorId, pendingAction);

      return NextResponse.json(
        {
          message: "Demande de suppression soumise pour validation",
          pendingAction,
        },
        { status: 202 },
      );
    }

    // Admin can delete directly
    const [deleted] = await db.delete(resources).where(eq(resources.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ressource supprimée" });
  } catch (error) {
    console.error("DELETE /api/resources error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
