import { Building2, type LucideIcon, MapPin, Package, ShoppingCart, Users } from "lucide-react";

export interface DashboardCardConfig {
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
  countKey?: "organizations" | "users";
}

export const DASHBOARD_CARDS: DashboardCardConfig[] = [
  {
    titleKey: "dashboardCards.users.title",
    descriptionKey: "dashboardCards.users.description",
    href: "/dashboard/users",
    icon: Users,
    countKey: "users",
  },
  // {
  //   title: "CRM",
  //   href: "/dashboard/crm",
  //   icon: UserCircle,
  //   description: "Gestion clients",
  // },
  // {
  //   title: "Finance",
  //   href: "/dashboard/finance",
  //   icon: DollarSign,
  //   description: "Gestion financière",
  // },
];
