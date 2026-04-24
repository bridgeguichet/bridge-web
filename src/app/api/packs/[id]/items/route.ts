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

  return total;
}

// POST /api/packs/[id]/items - Ajouter un item au pack
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: packId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const isDev = process.env.NODE_ENV === "development";

    // Vérifier ownership du pack
    const [pack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    if (!pack) {
      return NextResponse.json({ error: "Pack non trouvé" }, { status: 404 });
    }

    // En développement, permettre sans auth
    if (!isDev && !session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (session && pack.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { serviceId, variantId, categoryId, quantity, unitPrice, metadata } = body;

    // Calculer totalPrice
    const totalPrice = (quantity * Number.parseFloat(unitPrice)).toFixed(2);

    // Créer l'item
    const [item] = await db
      .insert(packItems)
      .values({
        packId,
        serviceId,
        variantId: variantId || null,
        categoryId,
        quantity,
        unitPrice,
        totalPrice,
        metadata: metadata || {},
      })
      .returning();

    // Recalculer le total du pack
    await recalculatePackTotal(packId);

    // Retourner le pack mis à jour
    const [updatedPack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    const items = await db.select().from(packItems).where(eq(packItems.packId, packId));

    return NextResponse.json({ ...updatedPack, items }, { status: 201 });
  } catch (error) {
    console.error("Error adding item to pack:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'item" },
      { status: 500 }
    );
  }
}
