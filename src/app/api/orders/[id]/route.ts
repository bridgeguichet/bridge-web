import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { orderAssignments, orderItems, orders } from "@/lib/db/schema";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier autorisation
    if (order.customerId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

    const assignments =
      items.length > 0
        ? await db.select().from(orderAssignments).where(eq(orderAssignments.orderItemId, items[0].id))
        : [];

    return NextResponse.json({ ...order, items, assignments });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération de la commande" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la commande" }, { status: 500 });
  }
}
