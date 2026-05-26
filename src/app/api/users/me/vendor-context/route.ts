import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users, vendorMembers, vendors } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Get full user data including isSuperUser
    const [userData] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    const isSuperUser = userData?.isSuperUser ?? false;

    // Super users have access to everything - return Bridge vendor as default
    if (isSuperUser) {
      const bridgeVendor = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true)).limit(1);

      if (bridgeVendor.length > 0) {
        return NextResponse.json({
          vendorId: bridgeVendor[0].id,
          vendorName: bridgeVendor[0].companyName,
          role: "admin",
          isBridgeOfficial: true,
          isStaff: true,
          isSuperUser: true,
          allVendors: true, // Flag to indicate super user can access any vendor
        });
      }
    }

    // Find user's vendor membership
    const membership = await db
      .select({
        member: vendorMembers,
        vendor: vendors,
      })
      .from(vendorMembers)
      .innerJoin(vendors, eq(vendorMembers.vendorId, vendors.id))
      .where(eq(vendorMembers.userId, user.id))
      .limit(1);

    if (membership.length === 0) {
      // User is not a vendor member - check if they are Bridge staff (admin/manager/operator role)
      // If so, return the Bridge vendor context
      if (user.role && user.role !== "customer") {
        const bridgeVendor = await db.select().from(vendors).where(eq(vendors.isBridgeOfficial, true)).limit(1);

        if (bridgeVendor.length > 0) {
          return NextResponse.json({
            vendorId: bridgeVendor[0].id,
            vendorName: bridgeVendor[0].companyName,
            role: user.role === "staff" ? "operator" : user.role,
            isBridgeOfficial: true,
            isStaff: true,
            isSuperUser: false,
          });
        }
      }

      return NextResponse.json({ error: "Aucun contexte vendor trouvé", vendorId: null, role: null }, { status: 404 });
    }

    const { member, vendor } = membership[0];

    return NextResponse.json({
      vendorId: vendor.id,
      vendorName: vendor.companyName,
      role: member.role,
      isBridgeOfficial: vendor.isBridgeOfficial,
      isStaff: vendor.isBridgeOfficial,
      isSuperUser: false,
    });
  } catch (error) {
    console.error("GET /api/users/me/vendor-context error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
