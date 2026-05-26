import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema/services";
import { users } from "@/lib/db/schema";

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
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    const [deleted] = await db.delete(serviceVariants).where(eq(serviceVariants.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Variante non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service variant:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la variante" }, { status: 500 });
  }
}
