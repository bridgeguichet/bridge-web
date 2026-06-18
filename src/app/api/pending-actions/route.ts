import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canPerform, getUserVendorRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { pendingActions, users } from "@/lib/db/schema";
import { notifyValidatorsForValidation } from "@/lib/notifications/validation";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// Helper to check if user is admin
async function isAdmin(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.role === "admin";
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const vendorId = searchParams.get("vendorId");
    const status = searchParams.get("status") || "pending";

    if (!vendorId) {
      return NextResponse.json({ error: "vendorId requis" }, { status: 400 });
    }

    // Check permission
    const role = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(role, "read", "pending_action")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Build query conditions
    const conditions = [eq(pendingActions.vendorId, vendorId), eq(pendingActions.status, status)];

    // Managers can only see their own pending actions, but can see all approved/rejected actions for their vendor
    if (role === "manager" && status === "pending") {
      conditions.push(eq(pendingActions.requestedBy, user.id));
    }

    const actions = await db
      .select({
        action: pendingActions,
        requester: {
          id: users.id,
          email: users.email,
          name: users.name,
        },
      })
      .from(pendingActions)
      .innerJoin(users, eq(pendingActions.requestedBy, users.id))
      .where(and(...conditions))
      .orderBy(pendingActions.createdAt);

    console.log(`📊 Pending Actions API - vendorId: ${vendorId}, status: ${status}, role: ${role}, count: ${actions.length}`);
    console.log(`📋 Actions trouvées:`, actions.map(a => ({ id: a.action.id, status: a.action.status, targetType: a.action.targetType })));

    return NextResponse.json(actions);
  } catch (error) {
    console.error("GET /api/pending-actions error:", error);
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
    const { vendorId, actionType, targetType, targetId, targetName, reason } = body;

    if (!vendorId || !actionType || !targetType || !targetId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Check permission - only manager and admin can create pending actions
    const role = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(role, "create", "pending_action")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    const [newAction] = await db
      .insert(pendingActions)
      .values({
        vendorId,
        requestedBy: user.id,
        actionType,
        targetType,
        targetId,
        targetName,
        reason,
        status: "pending",
      })
      .returning();

    // Notify admins (and managers if operator) in real time
    await notifyValidatorsForValidation(vendorId, newAction).catch((err) =>
      console.error("notifyValidatorsForValidation error:", err),
    );

    return NextResponse.json(newAction, { status: 201 });
  } catch (error) {
    console.error("POST /api/pending-actions error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

