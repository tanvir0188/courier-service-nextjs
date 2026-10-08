"use client";

import type { ReactNode } from "react";
import QueryProvider from "./query.provider";
import GoogleAuthProvider from "./google-auth.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </TooltipProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
}
