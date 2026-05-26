import type {
  Category,
  NewCategory,
  PendingAction,
  NewPendingAction,
  Resource,
  NewResource,
  Service,
  NewService,
  ServiceVariant,
  NewServiceVariant,
  User,
  VendorMember,
  NewVendorMember,
} from "@/lib/db/schema";

export type {
  Category,
  NewCategory,
  PendingAction,
  NewPendingAction,
  Resource,
  NewResource,
  Service,
  NewService,
  ServiceVariant,
  NewServiceVariant,
  User,
  VendorMember,
  NewVendorMember,
};

export type VendorRole = "admin" | "manager" | "operator";

export interface CreateVendorMemberInput {
  vendorId: string;
  role: VendorRole;
  userId?: string;
  email?: string;
}

export interface VendorContext {
  vendorId: string;
  vendorName: string;
  role: VendorRole;
  isBridgeOfficial: boolean;
  isStaff: boolean;
  isSuperUser: boolean;
  allVendors?: boolean; // Only for super users
}

export type ServiceStatus = "active" | "draft" | "archived";
export type ResourceStatus = "available" | "busy" | "offline";

export interface CategoryFilters {
  search?: string;
}

export interface ResourceFilters {
  type?: string;
  status?: string;
}

export interface ServiceFilters {
  categoryId?: string;
  status?: string;
  search?: string;
}

export interface UserFilters {
  role?: string;
  search?: string;
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Array<{
    id: string;
    categoryId: string;
    slug: string;
    nameFr: string;
    nameEn: string;
    description: string | null;
  }>;
}

export interface ServiceWithRelations extends Service {
  category: Category | null;
  vendor: { id: string; companyName: string } | null;
  variants: ServiceVariant[];
}
