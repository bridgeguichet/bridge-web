import type { Category, CustomPack, PackItem, Service, ServiceVariant } from "@/lib/db/schema";

export interface PackBuilderState {
  currentCategoryIndex: number;
  packId: string | null;
  items: PackItemWithDetails[];
  totalAmount: number;
  skippedCategories: string[];
}

export interface PackItemWithDetails extends PackItem {
  service?: Service;
  variant?: ServiceVariant;
  category?: Category;
}

export interface PackWithDetails extends CustomPack {
  items: PackItemWithDetails[];
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  isCompleted: boolean;
  isSkipped: boolean;
  isCurrent: boolean;
  itemCount: number;
}
