import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { canDeleteMember, canPerform, checkIsSuperUser, getUserVendorRole, requiresPendingApproval } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { pendingActions, users, vendorMembers } from "@/lib/db/schema";
import { notifyValidatorsForValidation } from "@/lib/notifications/validation";

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

    // Règles strictes pour la suppression de membres
    if (!canDeleteMember(currentRole, member.role as "admin" | "manager" | "operator", isSuperUser)) {
      const errorMessage = member.role === "admin" 
        ? "Permission refusée - Impossible de supprimer un administrateur"
        : "Permission refusée - Vous ne pouvez pas supprimer ce membre";
      
      // Log de sécurité pour les tentatives de suppression d'admin
      if (member.role === "admin") {
        console.warn(`🚨 TENTATIVE DE SUPPRESSION D'ADMIN - User: ${user.id} (${user.email}), Role: ${currentRole}, Target: ${member.userId} (${member.role})`);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 },
      );
    }

    // Check if deletion requires pending approval (manager or operator role)
    if (requiresPendingApproval(currentRole, "delete", "member")) {
      // Get user info for display
      const userInfo = await db.select().from(users).where(eq(users.id, member.userId)).limit(1);
      const userName = userInfo[0] ? userInfo[0].name : `Membre ${member.userId}`;
      
      // Create pending action instead of deleting
      const [pendingAction] = await db
        .insert(pendingActions)
        .values({
          vendorId: member.vendorId,
          requestedBy: user.id,
          actionType: "delete",
          targetType: "member",
          targetId: id,
          targetName: `${userName} (${member.role})`,
          status: "pending",
        })
        .returning();

      // Notifier les admins et managers pour validation
      await notifyValidatorsForValidation(member.vendorId, pendingAction);

      return NextResponse.json(
        {
          message: "Demande de suppression soumise pour validation",
          pendingAction,
        },
        { status: 202 },
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
