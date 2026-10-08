import type { SidebarItems } from "@/types";
import { LayoutDashboard, PackagePlus, Package } from "lucide-react";

const prefix = "/customer";

export const customerRoutes: SidebarItems = [
  {
    title: "Services",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Create Shipment",
        url: `${prefix}/new`,
        icon: PackagePlus,
      },
      {
        title: "My Shipments",
        url: `${prefix}/shipments`,
        icon: Package,
      },
    ],
  },
];
