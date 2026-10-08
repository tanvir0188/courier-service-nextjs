import type { SidebarItems } from "@/types";
import { LayoutDashboard, Users, Package, CreditCard } from "lucide-react";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Platform Overview",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: `${prefix}/users`,
        icon: Users,
      },
      {
        title: "All Shipments",
        url: `${prefix}/shipments`,
        icon: Package,
      },
      {
        title: "All Payments",
        url: `${prefix}/payments`,
        icon: CreditCard,
      },
    ],
  },
];
