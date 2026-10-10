import type { ReactNode } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import NavbarAuth from "@/components/shared/navbar-auth";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-dronet-grid">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Radio className="size-4 animate-pulse text-primary" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
              </div>
              <span className="text-lg font-black tracking-wider text-foreground">DRONET</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/tracking" className="hover:text-foreground transition-colors">
                Live Tracking
              </Link>
            </nav>
          </div>
          <NavbarAuth />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © 2026 DRONET Logistics Inc. All rights reserved. Dhaka, Bangladesh.
      </footer>
    </div>
  );
}
