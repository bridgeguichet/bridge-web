import { and, desc, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const limit = searchParams.get("limit");
  const userOnly = searchParams.get("userOnly") === "true";

  const conditions = [];

  if (type) {
    conditions.push(eq(orders.type, type));
  }

  if (status) {
    conditions.push(eq(orders.status, status));
  }

  if (startDate) {
    conditions.push(gte(orders.createdAt, new Date(startDate)));
  }

  if (endDate) {
    conditions.push(lte(orders.createdAt, new Date(endDate)));
  }

  // Non-admin users can only see their own orders
  if (userOnly || session.user.role !== "admin") {
    conditions.push(eq(orders.userId, session.user.id));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db.query.orders.findMany({
    where: whereClause,
    orderBy: desc(orders.createdAt),
    limit: limit ? parseInt(limit, 10) : undefined,
  });

  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      amount,
      currency = "USD",
      paymentMethod,
      items,
      metadata,
      description,
      orderNumber,
    } = body;

    if (!type || !amount || !paymentMethod || !items || !orderNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newOrder = await db
      .insert(orders)
      .values({
        id,
        userId: session.user.id,
        orderNumber,
        type,
        status: "pending",
        amount: amount.toString(),
        currency,
        paymentMethod,
        items,
        metadata,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
