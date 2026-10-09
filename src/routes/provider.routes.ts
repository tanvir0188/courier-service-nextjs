import type { SidebarItems } from "@/types";
import { LayoutDashboard, Package, Bike, CreditCard, MapPin } from "lucide-react";

const prefix = "/provider";

export const providerRoutes: SidebarItems = [
  {
    title: "Operations",
    items: [
      {
        title: "Dashboard",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Shipments",
        url: `${prefix}/shipments`,
        icon: Package,
      },
      {
        title: "Couriers",
        url: `${prefix}/couriers`,
        icon: Bike,
      },
      {
        title: "Delivery Zones",
        url: `${prefix}/zones`,
        icon: MapPin,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
        icon: CreditCard,
      },
    ],
  },
];
