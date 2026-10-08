import type { LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: string | number;
}

export interface SidebarGroupItem {
  title: string;
  items: SidebarSubItem[];
}

export type SidebarItems = SidebarGroupItem[];
