"use client";

import { usePathname, useRouter } from "next/navigation";
import type { UserRole } from "@/types";
import { getAuthToken, setAuthCookies } from "@/lib/auth-cookies";

interface RoleSwitcherProps {
  currentRole: UserRole;
}

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (role: UserRole) => {
    if (typeof window !== "undefined") {
      const existingToken = getAuthToken() || `demo_${role.toLowerCase()}_token`;
      setAuthCookies(existingToken, undefined, role);
    }

    if (role === "CUSTOMER") router.push("/customer");
    else if (role === "PROVIDER") router.push("/provider");
    else if (role === "ADMIN") router.push("/admin");
  };

  return (
    <div className="px-3 py-2 space-y-1.5 border-b border-border/50">
      <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
        Demo · Viewing As
      </div>
      <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/40">
        <button
          type="button"
          onClick={() => handleSwitch("CUSTOMER")}
          className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-all ${
            currentRole === "CUSTOMER"
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => handleSwitch("PROVIDER")}
          className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-all ${
            currentRole === "PROVIDER"
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Provider
        </button>
        <button
          type="button"
          onClick={() => handleSwitch("ADMIN")}
          className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-all ${
            currentRole === "ADMIN"
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
