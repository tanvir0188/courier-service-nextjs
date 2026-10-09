"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import type { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: ReactNode;
  role: UserRole;
}

export default function DashboardShell({
  children,
  role,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground antialiased bg-dronet-grid">
        <DashboardSidebar role={role} />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
                DHAKA · {role} PORTAL
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
