"use client";

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          You do not possess the required credentials or permissions to view this portal.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Switch Account</Link>
        </Button>
      </div>
    </div>
  );
}
