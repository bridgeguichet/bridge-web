import { db } from "@/lib/db";
import { users, vendorMembers, vendors } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type VendorRole = "admin" | "manager" | "operator";
export type Action = "create" | "read" | "update" | "delete";
export type TargetType = "vendor" | "category" | "service" | "variant" | "resource" | "member" | "pending_action";

const PERMISSION_MATRIX: Record<VendorRole, Record<TargetType, Action[]>> = {
  admin: {
    vendor: ["create", "read", "update", "delete"],
    category: ["create", "read", "update", "delete"],
    service: ["create", "read", "update", "delete"],
    variant: ["create", "read", "update", "delete"],
    resource: ["create", "read", "update", "delete"],
    member: ["create", "read", "update", "delete"],
    pending_action: ["create", "read", "update", "delete"], // approve/reject
  },
  manager: {
    vendor: ["create", "read"], // delete requires pending action
    category: ["create", "read", "update"], // delete requires pending action
    service: ["create", "read", "update"], // delete requires pending action
    variant: ["create", "read", "update"], // delete requires pending action
    resource: ["create", "read", "update"], // delete requires pending action
    member: ["create", "read"], // limited: cannot create 2nd manager, cannot delete manager
    pending_action: ["create", "read"], // can request, view own
  },
  operator: {
    vendor: [],
    category: ["create", "read"],
    service: ["create", "read"],
    variant: ["create", "read"],
    resource: ["create", "read"],
    member: [],
    pending_action: [],
  },
};

// Check if user is super user (dev access)
export async function checkIsSuperUser(userId: string): Promise<boolean> {
  const [user] = await db.select({ isSuperUser: users.isSuperUser }).from(users).where(eq(users.id, userId)).limit(1);
  return user?.isSuperUser ?? false;
}

export async function getUserVendorRole(userId: string, vendorId: string): Promise<VendorRole | null> {
  // Super users have admin access to everything
  const isSuper = await checkIsSuperUser(userId);
  if (isSuper) {
    return "admin";
  }

  // First check if user is a vendor member
  const member = await db
    .select()
    .from(vendorMembers)
    .where(and(eq(vendorMembers.userId, userId), eq(vendorMembers.vendorId, vendorId)))
    .limit(1);

  if (member && member.length > 0) {
    return member[0].role as VendorRole;
  }

  // Fallback: Check if this is the Bridge official vendor and user has staff role
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(and(eq(vendors.id, vendorId), eq(vendors.isBridgeOfficial, true)))
    .limit(1);

  if (vendor) {
    // This is the Bridge vendor - check if user has staff role in users table
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);

    if (user && user.role && user.role !== "customer") {
      // Map user.role to VendorRole
      // "staff" role becomes "operator"
      const roleMap: Record<string, VendorRole> = {
        admin: "admin",
        manager: "manager",
        operator: "operator",
        staff: "operator",
      };
      return roleMap[user.role] ?? null;
    }
  }

  return null;
}

export function canPerform(
  role: VendorRole | null,
  action: Action,
  targetType: TargetType,
  isSuperUser = false,
): boolean {
  // Super users can do everything
  if (isSuperUser) return true;

  if (!role) return false;

  const allowedActions = PERMISSION_MATRIX[role][targetType];
  return allowedActions.includes(action);
}

export function canDelete(role: VendorRole | null, targetType: TargetType): boolean {
  return canPerform(role, "delete", targetType);
}

export function requiresPendingApproval(role: VendorRole | null, action: Action, targetType: TargetType): boolean {
  if (!role || role === "admin") return false;
  if (role === "operator") return true; // operators always need approval for deletes

  // manager: delete requires approval (except for self-owned resources)
  if (role === "manager" && action === "delete") {
    return true;
  }

  return false;
}

// Special rules for member management
export function canCreateManager(role: VendorRole | null, existingManagersCount: number, isSuperUser = false): boolean {
  if (isSuperUser) return true;
  if (role !== "admin") return false;
  return existingManagersCount < 2;
}

export function canDeleteMember(
  currentUserRole: VendorRole | null,
  targetMemberRole: VendorRole,
  isSuperUser = false,
): boolean {
  if (isSuperUser) return true;
  if (!currentUserRole) return false;

  // admin can delete anyone
  if (currentUserRole === "admin") return true;

  // manager cannot delete another manager
  if (currentUserRole === "manager" && targetMemberRole === "manager") {
    return false;
  }

  // manager can delete operators
  if (currentUserRole === "manager" && targetMemberRole === "operator") {
    return true;
  }

  return false;
}

export function canCreateOperator(
  role: VendorRole | null,
  existingOperatorsCount: number,
  isSuperUser = false,
): boolean {
  if (isSuperUser) return true;
  if (!role) return false;

  // admin can create up to 3 operators
  if (role === "admin") return existingOperatorsCount < 3;

  // manager can create operators if under limit and total operators < 3
  if (role === "manager") {
    return existingOperatorsCount < 3;
  }

  return false;
}

// Error throwing helper for API routes
export function requirePermission(
  role: VendorRole | null,
  action: Action,
  targetType: TargetType,
): asserts role is VendorRole {
  if (!role) {
    throw new Error("Unauthorized: No role found");
  }

  if (!canPerform(role, action, targetType)) {
    throw new Error(`Forbidden: ${role} cannot ${action} ${targetType}`);
  }
}
