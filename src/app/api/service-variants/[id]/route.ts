import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema/services";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const [variant] = await db.update(serviceVariants).set(body).where(eq(serviceVariants.id, id)).returning();

    if (!variant) {
      return NextResponse.json({ error: "Variante non trouvée" }, { status: 404 });
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error updating service variant:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la variante" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
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
