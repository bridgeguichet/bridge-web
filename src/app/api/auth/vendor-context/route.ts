import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { vendorMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

    // Check if user has any vendor membership
    const membership = await db
      .select({
        vendorId: vendorMembers.vendorId,
        role: vendorMembers.role,
      })
      .from(vendorMembers)
      .where(eq(vendorMembers.userId, user.id))
      .limit(1);

    const vendorContext = membership.length > 0 
      ? { vendorId: membership[0].vendorId, role: membership[0].role }
      : null;

    console.log(`[Vendor Context] User: ${user.email}, VendorContext:`, vendorContext);

    return NextResponse.json(vendorContext);
  } catch (error) {
    console.error("[Vendor Context] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
