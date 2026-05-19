import { Banknote, Box, ChartBar, LayoutDashboard, type LucideIcon, Package, Tags, UserCog, Users } from "lucide-react";

export interface NavSubItem {
  titleKey: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  titleKey: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  labelKey?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        titleKey: "sidebar.dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    labelKey: "sidebar.admin",
    items: [
      {
        titleKey: "sidebar.services",
        url: "/dashboard/services",
        icon: Package,
      },
      {
        titleKey: "sidebar.categories",
        url: "/dashboard/categories",
        icon: Tags,
      },
      {
        titleKey: "sidebar.resources",
        url: "/dashboard/resources",
        icon: Box,
      },
      {
        titleKey: "sidebar.staff",
        url: "/dashboard/staff",
        icon: UserCog,
      },
      {
        titleKey: "sidebar.customers",
        url: "/dashboard/customers",
        icon: Users,
      },
    ],
  },
];
