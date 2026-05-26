import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { canDeleteMember, canPerform, checkIsSuperUser, getUserVendorRole } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { pendingActions, users, vendorMembers } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role: newRole } = body;

    // Get existing member
    const existingMember = await db.select().from(vendorMembers).where(eq(vendorMembers.id, id)).limit(1);
    if (existingMember.length === 0) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    const member = existingMember[0];

    // Check permission (super users bypass)
    const isSuperUser = await checkIsSuperUser(user.id);
    const currentRole = await getUserVendorRole(user.id, member.vendorId);
    if (!canPerform(currentRole, "update", "member", isSuperUser)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 });
    }

    // Cannot downgrade an admin (except by another admin or super user)
    if (!isSuperUser && member.role === "admin" && currentRole !== "admin") {
      return NextResponse.json({ error: "Seul un admin peut modifier un admin" }, { status: 403 });
    }

    const [updatedMember] = await db
      .update(vendorMembers)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(eq(vendorMembers.id, id))
      .returning();

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("PUT /api/vendor-members/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing member
    const existingMember = await db.select().from(vendorMembers).where(eq(vendorMembers.id, id)).limit(1);
    if (existingMember.length === 0) {
      return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
    }

    const member = existingMember[0];

    // Check permission (super users bypass)
    const isSuperUser = await checkIsSuperUser(user.id);
    const currentRole = await getUserVendorRole(user.id, member.vendorId);

    // Special member deletion rules
    if (!canDeleteMember(currentRole, member.role as "admin" | "manager" | "operator", isSuperUser)) {
      return NextResponse.json(
        { error: "Permission refusée - Vous ne pouvez pas supprimer ce membre" },
        { status: 403 },
      );
    }

    // Admin can delete directly
    await db.delete(vendorMembers).where(eq(vendorMembers.id, id));

    // Check if user has any other vendor memberships
    const remainingMemberships = await db.select().from(vendorMembers).where(eq(vendorMembers.userId, member.userId));

    // If no other memberships, restore role to "customer"
    if (remainingMemberships.length === 0) {
      await db.update(users).set({ role: "customer" }).where(eq(users.id, member.userId));
    }

    return NextResponse.json({ message: "Membre supprimé" });
  } catch (error) {
    console.error("DELETE /api/vendor-members/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
