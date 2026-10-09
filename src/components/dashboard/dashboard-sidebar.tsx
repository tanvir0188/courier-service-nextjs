"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { adminRoutes, customerRoutes, providerRoutes } from "@/routes";
import type { SidebarItems, UserRole } from "@/types";
import { LogOut, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RoleSwitcher } from "./role-switcher";

const sidebarRoutes: Record<UserRole, SidebarItems> = {
  CUSTOMER: customerRoutes,
  PROVIDER: providerRoutes,
  ADMIN: adminRoutes,
};

const defaultUsers: Record<UserRole, { name: string; title: string; initials: string }> = {
  CUSTOMER: { name: "Sadia Rahman", title: "Customer", initials: "SR" },
  PROVIDER: { name: "Swift Parcel BD", title: "Provider", initials: "SP" },
  ADMIN: { name: "Farzana Kabir", title: "Administrator", initials: "FK" },
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const routes: SidebarItems = sidebarRoutes[role] || [];
  const { data } = useGetMe();
  const logoutMutation = useLogout();

  const user = data?.data;
  const activeUser = user
    ? {
        name: user.name,
        title: user.role === "ADMIN" ? "Administrator" : user.role === "PROVIDER" ? "Provider" : "Customer",
        initials: user.name.slice(0, 2).toUpperCase(),
      }
    : defaultUsers[role];

  const handleSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <Sidebar className="border-r border-border/40 bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-border/40 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:scale-105 transition-transform">
            <Radio className="size-4 animate-pulse text-primary" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider text-foreground">DRONET</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
              Dhaka · {role}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Role Switcher */}
      <RoleSwitcher currentRole={role} />

      {/* Navigation Menu */}
      <SidebarContent className="px-2 py-3">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? "bg-primary/15 text-primary border-l-2 border-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Link href={item.url} className="flex items-center gap-2.5">
                          {Icon && <Icon className="size-4" />}
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-mono">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer Profile & Logout */}
      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card/60 border border-border/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground border border-border/50">
              {activeUser.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-foreground">
                {activeUser.name}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize truncate">
                {activeUser.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
