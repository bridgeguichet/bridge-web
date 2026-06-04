import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canPerform, getUserVendorRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { pendingActions } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return NextResponse.json({ error: "vendorId requis" }, { status: 400 });
    }

    // Check permission
    const role = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(role, "read", "pending_action")) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Compter par statut
    const { count } = await import("drizzle-orm");
    const stats = await db
      .select({
        status: pendingActions.status,
        count: count(pendingActions.id),
      })
      .from(pendingActions)
      .where(eq(pendingActions.vendorId, vendorId))
      .groupBy(pendingActions.status);

    // Construire l'objet de statistiques
    const result = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach(stat => {
      result[stat.status as keyof typeof result] = Number(stat.count);
    });

    console.log(`📊 Pending Actions Stats - vendorId: ${vendorId}, role: ${role}, stats:`, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/pending-actions/stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
