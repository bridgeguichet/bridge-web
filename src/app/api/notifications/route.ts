import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const type = searchParams.get("type");
    const offset = (page - 1) * limit;

    const conditions = [eq(notifications.userId, user.id)];
    if (unreadOnly) conditions.push(isNull(notifications.readAt));
    if (type) conditions.push(eq(notifications.type, type));

    const whereClause = and(...conditions);

    const [rows, totalRows, unreadRows] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(whereClause)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(notifications).where(whereClause),
      db
        .select({ count: count() })
        .from(notifications)
        .where(and(eq(notifications.userId, user.id), isNull(notifications.readAt))),
    ]);

    const total = totalRows[0]?.count ?? 0;
    const unreadCount = unreadRows[0]?.count ?? 0;

    return NextResponse.json({
      notifications: rows,
      total,
      unreadCount,
      hasMore: offset + rows.length < total,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!type || !title || !message) {
      return NextResponse.json({ error: "Champs requis manquants (type, title, message)" }, { status: 400 });
    }

    const targetUserId = user.role === "admin" && userId ? userId : user.id;

    const [notification] = await db
      .insert(notifications)
      .values({
        id: generateId(),
        userId: targetUserId,
        type,
        title,
        message,
        data: data ?? null,
      })
      .returning();

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    if (body.markAllRead) {
      await db
        .update(notifications)
        .set({ readAt: sql`NOW()` })
        .where(and(eq(notifications.userId, user.id), isNull(notifications.readAt)));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
