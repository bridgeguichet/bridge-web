import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { customPacks, packItems } from "@/lib/db/schema";

// Helper: Recalculer le total du pack
async function recalculatePackTotal(packId: string) {
  const items = await db.select().from(packItems).where(eq(packItems.packId, packId));

  const total = items.reduce((sum, item) => {
    return sum + (Number.parseFloat(item.totalPrice) || 0);
  }, 0);

  await db
    .update(customPacks)
    .set({
      totalAmount: total.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(customPacks.id, packId));
}

// DELETE /api/packs/[id]/items/[itemId] - Retirer un item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const { id: packId, itemId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const isDev = process.env.NODE_ENV === "development";

    // Vérifier ownership
    const [pack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    if (!pack) {
      return NextResponse.json({ error: "Pack non trouvé" }, { status: 404 });
    }

    if (!isDev && !session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (session && pack.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Supprimer l'item
    await db.delete(packItems).where(eq(packItems.id, itemId));

    // Recalculer le total
    await recalculatePackTotal(packId);

    // Retourner le pack mis à jour
    const [updatedPack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    const items = await db.select().from(packItems).where(eq(packItems.packId, packId));

    return NextResponse.json({ ...updatedPack, items });
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'item" }, { status: 500 });
  }
}

// PATCH /api/packs/[id]/items/[itemId] - Modifier la quantité
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const { id: packId, itemId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const isDev = process.env.NODE_ENV === "development";

    // Vérifier ownership
    const [pack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    if (!pack) {
      return NextResponse.json({ error: "Pack non trouvé" }, { status: 404 });
    }

    if (!isDev && !session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (session && pack.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { quantity } = body;

    // Récupérer l'item pour calculer le nouveau total
    const [item] = await db.select().from(packItems).where(eq(packItems.id, itemId));

    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    const newTotalPrice = (quantity * Number.parseFloat(item.unitPrice)).toFixed(2);

    // Mettre à jour l'item
    await db
      .update(packItems)
      .set({
        quantity,
        totalPrice: newTotalPrice,
      })
      .where(eq(packItems.id, itemId));

    // Recalculer le total du pack
    await recalculatePackTotal(packId);

    // Retourner le pack mis à jour
    const [updatedPack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    const items = await db.select().from(packItems).where(eq(packItems.packId, packId));

    return NextResponse.json({ ...updatedPack, items });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'item" }, { status: 500 });
  }
}
