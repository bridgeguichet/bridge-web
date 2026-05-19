import type { Category, Service, ServiceVariant } from "@/lib/db/schema";

export interface PackBuilderState {
  currentCategoryIndex: number;
  packId: string | null;
  items: PackItemWithDetails[];
  totalAmount: number;
  skippedCategories: string[];
}

export interface PackItemWithDetails {
  id: string;
  packId: string;
  serviceId: string;
  variantId: string | null;
  categoryId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  metadata: Record<string, unknown>;
  addedAt: Date;
  service?: Service;
  variant?: ServiceVariant;
  category?: Category;
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  isCompleted: boolean;
  isSkipped: boolean;
  isCurrent: boolean;
  itemCount: number;
}
