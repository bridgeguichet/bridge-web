import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import {
  canCreateManager,
  canCreateOperator,
  canDeleteMember,
  canPerform,
  checkIsSuperUser,
  getUserVendorRole,
} from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users, vendorMembers } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// Helper to get members count by role
async function getMembersCount(vendorId: string, role: string) {
  const members = await db
    .select()
    .from(vendorMembers)
    .where(and(eq(vendorMembers.vendorId, vendorId), eq(vendorMembers.role, role)));
  return members.length;
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

    // Check permission (super users bypass)
    const isSuperUser = await checkIsSuperUser(user.id);
    const role = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(role, "read", "member", isSuperUser)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    const members = await db
      .select({
        member: vendorMembers,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
        },
      })
      .from(vendorMembers)
      .innerJoin(users, eq(vendorMembers.userId, users.id))
      .where(eq(vendorMembers.vendorId, vendorId));

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/vendor-members error:", error);
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
    const { vendorId, userId: rawUserId, email, role: newRole } = body;

    if (!vendorId || (!rawUserId && !email) || !newRole) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Resolve userId from email if provided
    let userId = rawUserId;
    if (!userId && email) {
      const found = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.trim().toLowerCase()))
        .limit(1);
      if (found.length === 0) {
        return NextResponse.json({ error: `Aucun utilisateur trouvé avec l'email: ${email}` }, { status: 404 });
      }
      userId = found[0].id;
    }

    // Check permission (super users bypass)
    const isSuperUser = await checkIsSuperUser(user.id);
    const currentRole = await getUserVendorRole(user.id, vendorId);
    if (!canPerform(currentRole, "create", "member", isSuperUser)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Check role-specific limits and permissions (super users bypass all)
    if (!isSuperUser) {
      if (newRole === "admin") {
        // Only existing admins can create another admin
        if (currentRole !== "admin") {
          return NextResponse.json({ error: "Seul un admin peut créer un admin" }, { status: 403 });
        }
      }

      if (newRole === "manager") {
        // Only admin can create managers
        if (currentRole !== "admin") {
          return NextResponse.json({ error: "Seul un admin peut créer un manager" }, { status: 403 });
        }

        // Check limit: max 2 managers
        const managersCount = await getMembersCount(vendorId, "manager");
        if (!canCreateManager(currentRole, managersCount, isSuperUser)) {
          return NextResponse.json({ error: "Maximum 2 managers autorisés" }, { status: 403 });
        }
      }

      if (newRole === "operator") {
        // Check limit: max 3 operators total
        const operatorsCount = await getMembersCount(vendorId, "operator");
        if (!canCreateOperator(currentRole, operatorsCount, isSuperUser)) {
          return NextResponse.json({ error: "Maximum 3 opérateurs autorisés" }, { status: 403 });
        }
      }
    }

    // Check if user is already a member
    const existing = await db
      .select()
      .from(vendorMembers)
      .where(and(eq(vendorMembers.vendorId, vendorId), eq(vendorMembers.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Utilisateur déjà membre de ce vendor" }, { status: 409 });
    }

    const [newMember] = await db
      .insert(vendorMembers)
      .values({
        vendorId,
        userId,
        role: newRole,
      })
      .returning();

    // Update user role based on vendor member role
    const roleMapping: Record<string, string> = {
      admin: "admin",
      manager: "manager",
      operator: "operator",
    };
    const userRole = roleMapping[newRole];
    if (userRole) {
      await db.update(users).set({ role: userRole }).where(eq(users.id, userId));
    }

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("POST /api/vendor-members error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
