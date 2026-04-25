/**
 * Mappers pour convertir les données du backend Django vers le format Drizzle attendu par le frontend
 */

export interface MappedCategory {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  icon: string | null;
  sortOrder: number;
  subcategories: MappedSubcategory[];
}

export interface MappedSubcategory {
  id: string;
  categoryId: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  description: string | null;
}

export interface MappedService {
  id: string;
  vendorId: string;
  categoryId: string;
  subcategoryId: string | null;
  nameFr: string;
  nameEn: string;
  descriptionFr: string | null;
  descriptionEn: string | null;
  basePrice: string;
  priceUnit?: string | null;
  status: string;
  imageUrl: string | null;
  category?: MappedCategory;
  vendor?: Record<string, unknown>;
  variants?: MappedVariant[];
}

export interface MappedVariant {
  id: string;
  serviceId: string;
  nameFr: string;
  nameEn: string;
  priceModifier: string;
  metadata: Record<string, unknown> | null;
  sortOrder: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getId(obj: any): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object" && obj !== null) return obj.id || "";
  return "";
}

// Mapper pour les catégories
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoCategoryToFrontend(djangoCategory: any): MappedCategory {
  return {
    id: djangoCategory.id || "",
    slug: djangoCategory.slug || "",
    nameFr: djangoCategory.name_fr || djangoCategory.name || "",
    nameEn: djangoCategory.name_en || djangoCategory.name || "",
    icon: djangoCategory.icon || null,
    sortOrder: djangoCategory.sort_order || 0,
    subcategories: Array.isArray(djangoCategory.subcategories)
      ? djangoCategory.subcategories.map(mapDjangoSubcategoryToFrontend)
      : [],
  };
}

// Mapper pour les sous-catégories
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoSubcategoryToFrontend(djangoSub: any): MappedSubcategory {
  return {
    id: djangoSub.id || "",
    categoryId: djangoSub.category_id || getId(djangoSub.category) || "",
    slug: djangoSub.slug || "",
    nameFr: djangoSub.name_fr || djangoSub.name || "",
    nameEn: djangoSub.name_en || djangoSub.name || "",
    description: djangoSub.description || null,
  };
}

// Mapper pour les services
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoServiceToFrontend(djangoService: any): MappedService {
  const category = djangoService.category ? mapDjangoCategoryToFrontend(djangoService.category) : undefined;

  const variants = Array.isArray(djangoService.variants)
    ? djangoService.variants.map(mapDjangoVariantToFrontend)
    : undefined;

  return {
    id: djangoService.id || "",
    vendorId: djangoService.vendor_id || getId(djangoService.vendor),
    categoryId: djangoService.category_id || getId(djangoService.category),
    subcategoryId: djangoService.subcategory_id || getId(djangoService.subcategory) || null,
    nameFr: djangoService.name_fr || djangoService.name || "",
    nameEn: djangoService.name_en || djangoService.name || "",
    descriptionFr: djangoService.description_fr || djangoService.description || null,
    descriptionEn: djangoService.description_en || null,
    basePrice: String(djangoService.base_price || djangoService.price || "0"),
    priceUnit: djangoService.price_unit || djangoService.priceUnit || null,
    status: djangoService.status || "active",
    imageUrl: djangoService.image_url || djangoService.image || null,
    category,
    vendor: djangoService.vendor,
    variants,
  };
}

// Mapper pour les variants de service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoVariantToFrontend(djangoVariant: any): MappedVariant {
  return {
    id: djangoVariant.id || "",
    serviceId: djangoVariant.service_id || "",
    nameFr: djangoVariant.name_fr || djangoVariant.name || "",
    nameEn: djangoVariant.name_en || djangoVariant.name || "",
    priceModifier: String(djangoVariant.price_modifier || "0"),
    metadata: djangoVariant.metadata || null,
    sortOrder: djangoVariant.sort_order || 0,
  };
}

// Fonctions utilitaires pour mapper des listes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoCategoriesToFrontend(djangoCategories: any[]): MappedCategory[] {
  return djangoCategories.map(mapDjangoCategoryToFrontend);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDjangoServicesToFrontend(djangoServices: any[]): MappedService[] {
  return djangoServices.map(mapDjangoServiceToFrontend);
}
