import { getMe } from "@/service/getMe";
import { logout } from "@/service/logout";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { LayoutDashboard, LogOut } from "lucide-react";

export default async function NavbarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const cookieRole = cookieStore.get("user_role")?.value;

  if (!token) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={buttonVariants({ size: "sm" })}
        >
          Get Started
        </Link>
      </div>
    );
  }

  const session = await getMe();
  const user = session?.success ? session.data : null;

  const userEmail = user?.email || (cookieRole ? `${cookieRole.toLowerCase()}@dronet.io` : "user@dronet.io");
  const userName = user?.name || (cookieRole ? `${cookieRole} Demo` : "User");
  const role = user?.role || cookieRole || "CUSTOMER";
  const initials = userName ? userName.slice(0, 2).toUpperCase() : "US";
  const dashboardHref = role === "ADMIN" ? "/admin" : role === "PROVIDER" ? "/provider" : "/customer";

  return (
    <div className="flex items-center gap-3">
      {/* User profile & role pill */}
      <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border/40 text-xs">
        <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
          {initials}
        </div>
        <span className="font-medium text-foreground max-w-[120px] truncate">{userName}</span>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
          {role}
        </span>
      </div>

      {/* Direct link to role dashboard */}
      <Link
        href={dashboardHref}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <LayoutDashboard className="size-3.5 mr-1.5 text-primary" />
        Dashboard
      </Link>

      {/* Logout button calling server action */}
      <form action={logout}>
        <button
          type="submit"
          title="Sign out"
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
