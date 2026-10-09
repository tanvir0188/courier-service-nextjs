"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "784897472073-pl2e27381hj05c0m5umfecfvl6pfa38m.apps.googleusercontent.com";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
