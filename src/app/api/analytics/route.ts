import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { analytics } from "@/lib/db/schema";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30";
  const source = searchParams.get("source");
  const page = searchParams.get("page");

  // Calculate date range
  const days = parseInt(period, 10);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const conditions = [
    gte(analytics.date, startDate),
    lte(analytics.date, endDate),
  ];

  if (source) {
    conditions.push(eq(analytics.source, source));
  }

  if (page) {
    conditions.push(eq(analytics.page, page));
  }

  const whereClause = and(...conditions);

  try {
    const results = await db.query.analytics.findMany({
      where: whereClause,
      orderBy: desc(analytics.date),
    });

    // Aggregate by date (sum all sources per day)
    const aggregated = results.reduce((acc, row) => {
      const dateKey = row.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          visitors: 0,
          pageViews: 0,
          uniqueVisitors: 0,
        };
      }
      acc[dateKey].visitors += row.visitors;
      acc[dateKey].pageViews += row.pageViews;
      acc[dateKey].uniqueVisitors += row.uniqueVisitors;
      return acc;
    }, {} as Record<string, { date: string; visitors: number; pageViews: number; uniqueVisitors: number }>);

    // Convert to array and sort by date
    const data = Object.values(aggregated).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  // Allow tracking for both authenticated and anonymous users
  // but rate limit anonymous tracking

  try {
    const body = await request.json();
    const { page, source = "direct" } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const id = `anl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if there's already an entry for today with this source/page
    const existing = await db.query.analytics.findFirst({
      where: and(
        eq(analytics.date, today),
        eq(analytics.source, source),
        page ? eq(analytics.page, page) : undefined
      ),
    });

    if (existing) {
      // Update existing record
      const updated = await db
        .update(analytics)
        .set({
          visitors: existing.visitors + 1,
          pageViews: existing.pageViews + 1,
          updatedAt: new Date(),
        })
        .where(eq(analytics.id, existing.id))
        .returning();

      return NextResponse.json(updated[0]);
    }

    // Create new record
    const newAnalytics = await db
      .insert(analytics)
      .values({
        id,
        date: today,
        visitors: 1,
        pageViews: 1,
        uniqueVisitors: 1,
        source: source as typeof analytics.$inferSelect.source,
        page,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newAnalytics[0], { status: 201 });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}
