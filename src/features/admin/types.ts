import type { Category, NewCategory, Resource, NewResource, Service, NewService, ServiceVariant, NewServiceVariant, User } from "@/lib/db/schema";

export type { Category, NewCategory, Resource, NewResource, Service, NewService, ServiceVariant, NewServiceVariant, User };

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
