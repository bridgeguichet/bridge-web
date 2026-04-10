import { servicePacks } from "./data";
import type { Service, ServicePack } from "./types";

export function detectMatchingPacks(selectedServiceIds: string[], userProfile?: string): ServicePack[] {
  if (selectedServiceIds.length === 0) return [];

  const matchedPacks: Array<{ pack: ServicePack; matchScore: number }> = [];

  for (const pack of servicePacks) {
    const packServices = new Set(pack.services);
    const selectedSet = new Set(selectedServiceIds);

    const matchingServices = pack.services.filter((serviceId) => selectedSet.has(serviceId));
    const matchCount = matchingServices.length;

    if (matchCount >= 2) {
      const matchPercentage = matchCount / pack.services.length;
      const profileMatch = userProfile ? pack.relevantFor.includes(userProfile) : true;
      const score = profileMatch ? matchPercentage * 1.2 : matchPercentage;

      matchedPacks.push({ pack, matchScore: score });
    }
  }

  return matchedPacks.sort((a, b) => b.matchScore - a.matchScore).map((item) => item.pack);
}

export function getRelevantServices(allServices: Service[], userProfile?: string): Service[] {
  if (!userProfile) return allServices;

  return allServices.filter((service) => service.relevantFor.includes(userProfile));
}

export function groupServicesByCategory(services: Service[], userProfile?: string): Map<string, Service[]> {
  const grouped = new Map<string, Service[]>();

  for (const service of services) {
    const existing = grouped.get(service.category) || [];
    grouped.set(service.category, [...existing, service]);
  }

  const sortedMap = new Map<string, Service[]>();

  let priorityOrder: string[];

  if (userProfile === "investissement") {
    priorityOrder = ["Business & Investissement", "Banque & Assurance"];
  } else if (
    userProfile === "nextgen" ||
    userProfile === "study" ||
    userProfile === "business" ||
    userProfile === "employment"
  ) {
    priorityOrder = ["Bridge Next-Gen", "Conseil Avant Départ"];
  } else if (userProfile === "retraite") {
    priorityOrder = ["Bridge Renaissance (Retraite)", "Santé & Assistance", "Installation & Vie", "Arrivée & Mobilité"];
  } else {
    priorityOrder = ["Conseil Avant Départ"];
  }

  for (const category of priorityOrder) {
    if (grouped.has(category)) {
      sortedMap.set(category, grouped.get(category)!);
    }
  }

  for (const [category, categoryServices] of grouped.entries()) {
    if (!priorityOrder.includes(category)) {
      sortedMap.set(category, categoryServices);
    }
  }

  return sortedMap;
}

export function getServiceById(services: Service[], serviceId: string): Service | undefined {
  return services.find((s) => s.id === serviceId);
}

// Map service IDs to translation keys (camelCase)
export function getServiceTranslationKey(serviceId: string): string {
  // Convert kebab-case to camelCase
  return serviceId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Map category names to translation keys
export function getCategoryTranslationKey(category: string): string {
  const categoryMap: Record<string, string> = {
    "Conseil Avant Départ": "conseilAvantDepart",
    "Formalisation Expatrié": "formalisationExpat",
    "Arrivée & Mobilité": "arriveeMobilite",
    "Installation & Vie": "installationVie",
    "Santé & Assistance": "santeAssistance",
    "Banque & Assurance": "banqueAssurance",
    "Formalisation & Régularisation": "formalisationRegularisation",
    "Business & Investissement": "businessInvestissement",
    "Bridge Next-Gen": "bridgeNextGen",
    "Bridge Renaissance (Retraite)": "bridgeRenaissance",
  };
  return categoryMap[category] || category;
}

// Map subcategory names to translation keys
export function getSubcategoryTranslationKey(subcategory: string): string {
  const subcategoryMap: Record<string, string> = {
    "Accueil & Coordination": "accueilCoordination",
    "Mobilité & Voyage": "mobiliteVoyage",
    Logement: "logement",
    Installation: "installation",
    "Orientation Quotidienne": "orientationQuotidienne",
    Banque: "banque",
  };
  return subcategoryMap[subcategory] || subcategory;
}

// Map pack IDs to translation keys
export function getPackTranslationKey(packId: string): string {
  return getServiceTranslationKey(packId);
}
