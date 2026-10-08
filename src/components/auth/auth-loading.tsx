"use client";

import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({
  label = "Verifying session...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Spinner className="size-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {label}
      </p>
    </div>
  );
}
