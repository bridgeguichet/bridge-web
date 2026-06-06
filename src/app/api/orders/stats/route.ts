import { and, eq, gte, sql } from "drizzle-orm";
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

  // Build base conditions
  const conditions = [];

  if (type) {
    conditions.push(eq(orders.type, type));
  }

  // For non-admin, restrict to their own orders
  if (session.user.role !== "admin") {
    conditions.push(eq(orders.userId, session.user.id));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get this month's start date
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // Get all orders matching criteria
    const allOrders = await db.query.orders.findMany({
      where: whereClause,
    });

    // Calculate stats
    const completedOrders = allOrders.filter((o) => o.status === "completed");
    const pendingOrders = allOrders.filter((o) => o.status === "pending");
    const failedOrders = allOrders.filter((o) => o.status === "failed");

    const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.amount), 0);

    const thisMonthOrders = completedOrders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= thisMonthStart;
    });
    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.amount), 0);

    // Count by type
    const orderCount = allOrders.filter((o) => o.type === "order").length;
    const packCount = allOrders.filter((o) => o.type === "pack").length;

    return NextResponse.json({
      totalRevenue,
      thisMonthRevenue,
      totalCount: allOrders.length,
      completedCount: completedOrders.length,
      pendingCount: pendingOrders.length,
      failedCount: failedOrders.length,
      orderCount,
      packCount,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch order stats" },
      { status: 500 }
    );
  }
}
