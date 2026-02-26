import {
  AlertTriangle,
  Building2,
  Gem,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Pickaxe,
  ReceiptText,
  SquareArrowUpRight,
  Users,
  Banknote,
  Gauge,
  ChartBar,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  Forklift,
} from "lucide-react";

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
    labelKey: "sidebar.dashboards",
    items: [
      {
        titleKey: "sidebar.dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        titleKey: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        titleKey: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        titleKey: "Analytics",
        url: "/dashboard/coming-soon",
        icon: Gauge,
        comingSoon: true,
      },
      {
        titleKey: "Logistics",
        url: "/dashboard/coming-soon",
        icon: Forklift,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    labelKey: "sidebar.pages",
    items: [
      {
        titleKey: "Email",
        url: "/dashboard/coming-soon",
        icon: Mail,
        comingSoon: true,
      },
      {
        titleKey: "Chat",
        url: "/dashboard/coming-soon",
        icon: MessageSquare,
        comingSoon: true,
      },
      {
        titleKey: "Calendar",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
      },
      {
        titleKey: "Kanban",
        url: "/dashboard/coming-soon",
        icon: Kanban,
        comingSoon: true,
      },
      {
        titleKey: "Invoice",
        url: "/dashboard/coming-soon",
        icon: ReceiptText,
        comingSoon: true,
      },
      {
        titleKey: "sidebar.users",
        url: "/dashboard/users",
        icon: Users,
        comingSoon: false,
      },
      // {
      //   title: "Roles",
      //   url: "/dashboard/roles",
      //   icon: Lock,
      //   comingSoon: false,
      // },
      // {
      //   title: "Authentication",
      //   url: "/auth",
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: "Login v1", url: "/auth/v1/login", newTab: true },
      //     { title: "Login v2", url: "/auth/v2/login", newTab: true },
      //     { title: "Register v1", url: "/auth/v1/register", newTab: true },
      //     { title: "Register v2", url: "/auth/v2/register", newTab: true },
      //   ],
      // },
    ],
  },
  // {
  //   id: 3,
  //   label: "Misc",
  //   items: [
  //     {
  //       title: "Others",
  //       url: "/dashboard/coming-soon",
  //       icon: SquareArrowUpRight,
  //       comingSoon: true,
  //     },
  //   ],
  // },
];
