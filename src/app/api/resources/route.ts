import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";

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
        ? await db.select().from(resources).where(and(...conditions)).orderBy(resources.createdAt)
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
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    const [deleted] = await db.delete(resources).where(eq(resources.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/resources error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const [resource] = await db.update(resources).set(data).where(eq(resources.id, id)).returning();

    if (!resource) {
      return NextResponse.json({ error: "Ressource non trouvée" }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la ressource" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const [deleted] = await db.delete(resources).where(eq(resources.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Ressource non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la ressource" }, { status: 500 });
  }
}
