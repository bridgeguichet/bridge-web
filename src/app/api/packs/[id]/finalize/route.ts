import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { customPacks, orderItems, orders, packItems } from "@/lib/db/schema";

// POST /api/packs/[id]/finalize - Finaliser le pack et créer une commande
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: packId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier ownership
    const [pack] = await db.select().from(customPacks).where(eq(customPacks.id, packId));

    if (!pack) {
      return NextResponse.json({ error: "Pack non trouvé" }, { status: 404 });
    }

    if (pack.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Vérifier que le pack a des items
    const items = await db.select().from(packItems).where(eq(packItems.packId, packId));

    if (items.length === 0) {
      return NextResponse.json({ error: "Le pack doit contenir au moins un service" }, { status: 400 });
    }

    // Récupérer le premier service pour obtenir le vendorId
    const { services } = await import("@/lib/db/schema");
    const [firstService] = await db.select().from(services).where(eq(services.id, items[0].serviceId));

    if (!firstService?.vendorId) {
      return NextResponse.json({ error: "Service sans vendeur associé" }, { status: 400 });
    }

    // Générer numéro de commande
    const orderNumber = `PACK-${Date.now()}`;

    // Créer la commande
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId: session.user.id,
        vendorId: firstService.vendorId,
        totalAmount: pack.totalAmount,
        paymentMethod: "pending",
        status: "pending",
        paymentStatus: "pending",
        notes: `Commande créée depuis le pack: ${pack.name || "Mon Pack Personnalisé"}`,
      })
      .returning();

    // Créer les order items à partir des pack items
    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        serviceId: item.serviceId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        metadata: item.metadata,
      })),
    );

    // Mettre à jour le statut du pack
    await db
      .update(customPacks)
      .set({
        status: "finalized",
        updatedAt: new Date(),
      })
      .where(eq(customPacks.id, packId));

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Error finalizing pack:", error);
    return NextResponse.json({ error: "Erreur lors de la finalisation du pack" }, { status: 500 });
  }
}
