import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const conditions = [];
    if (type) {
      conditions.push(eq(resources.type, type));
    }
    if (status) {
      conditions.push(eq(resources.status, status));
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(resources)
            .where(and(...conditions))
        : await db.select().from(resources);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des ressources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const [resource] = await db.insert(resources).values(body).returning();

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la ressource" }, { status: 500 });
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
