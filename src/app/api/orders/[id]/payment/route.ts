import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { orders, payments } from "@/lib/db/schema";
import { processPayment } from "@/lib/payments";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { method, metadata } = body;

    const [order] = await db.select().from(orders).where(eq(orders.id, params.id));

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier que c'est la commande de l'utilisateur
    if (order.customerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Traiter paiement
    const result = await processPayment(method, parseFloat(order.totalAmount), metadata);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Erreur paiement" }, { status: 400 });
    }

    // Enregistrer paiement
    const [payment] = await db
      .insert(payments)
      .values({
        orderId: order.id,
        amount: order.totalAmount,
        method,
        status: "completed",
        providerReference: result.reference,
        metadata,
      })
      .returning();

    // Mettre à jour commande
    await db
      .update(orders)
      .set({
        paymentStatus: "completed",
        status: "confirmed",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Erreur lors du traitement du paiement" }, { status: 500 });
  }
}
