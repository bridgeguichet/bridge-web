export const queryKeys = {
  // Marketplace
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    detail: (id: string) => [...queryKeys.categories.all, id] as const,
  },
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.services.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.services.all, id] as const,
    variants: (serviceId: string) => [...queryKeys.services.detail(serviceId), "variants"] as const,
    availability: (serviceId: string) => [...queryKeys.services.detail(serviceId), "availability"] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.orders.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
    assignments: (orderId: string) => [...queryKeys.orders.detail(orderId), "assignments"] as const,
  },
  resources: {
    all: ["resources"] as const,
    lists: () => [...queryKeys.resources.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.resources.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.resources.all, id] as const,
    availability: (resourceId: string) => [...queryKeys.resources.detail(resourceId), "availability"] as const,
  },
  cart: {
    all: ["cart"] as const,
    items: () => [...queryKeys.cart.all, "items"] as const,
  },
  packs: {
    all: ["packs"] as const,
    lists: () => [...queryKeys.packs.all, "list"] as const,
    list: () => [...queryKeys.packs.lists()] as const,
    detail: (id: string) => [...queryKeys.packs.all, id] as const,
    items: (packId: string) => [...queryKeys.packs.detail(packId), "items"] as const,
  },
};
