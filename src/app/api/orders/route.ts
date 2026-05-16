import { type NextRequest, NextResponse } from "next/server";

import { and, desc, eq, like } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const conditions = [eq(orders.customerId, session.user.id)];
    if (type === "pack") {
      conditions.push(like(orders.orderNumber, "PACK-%"));
    } else if (type === "single") {
      conditions.push(like(orders.orderNumber, "ORD-%"));
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(orders.createdAt));

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { items, vendorId, totalAmount, paymentMethod, notes } = body;

    // Générer numéro de commande
    const orderNumber = `ORD-${Date.now()}`;

    // Créer commande
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId: session.user.id,
        vendorId,
        totalAmount,
        paymentMethod,
        status: "pending",
        paymentStatus: "pending",
        notes,
      })
      .returning();

    // Créer items
    await db.insert(orderItems).values(
      items.map((item: any) => ({
        orderId: order.id,
        serviceId: item.serviceId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        metadata: item.metadata,
      })),
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}
