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
  serviceVariants: {
    all: ["serviceVariants"] as const,
    list: (serviceId: string) => [...queryKeys.serviceVariants.all, serviceId] as const,
  },
  resources: {
    all: ["resources"] as const,
    lists: () => [...queryKeys.resources.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.resources.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.resources.all, id] as const,
    availability: (resourceId: string) => [...queryKeys.resources.detail(resourceId), "availability"] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
    staff: () => [...queryKeys.users.all, "staff"] as const,
    customers: () => [...queryKeys.users.all, "customers"] as const,
  },
  cart: {
    all: ["cart"] as const,
    items: () => [...queryKeys.cart.all, "items"] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.orders.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
    stats: (type?: string) => [...queryKeys.orders.all, "stats", type] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    activity: (period: string) => [...queryKeys.analytics.all, "activity", period] as const,
  },
};
