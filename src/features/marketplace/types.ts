import type {
  Category,
  Service,
  ServiceVariant,
  Subcategory,
} from "@/lib/db/schema";

export interface ServiceFilters {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  status?: string;
  offset?: number;
  [key: string]: string | number | undefined;
}

export interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

export interface ServiceWithDetails extends Service {
  variants?: ServiceVariant[];
  category?: Category;
}
