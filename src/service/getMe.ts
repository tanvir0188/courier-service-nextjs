"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import config from "@/config/config";

export const getMe = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return { success: false, message: "User not logged in!" };
  }

  // Handle demo fallback sessions
  if (accessToken.startsWith("demo_")) {
    const cookieRole = cookieStore.get("user_role")?.value || "CUSTOMER";
    return {
      success: true,
      data: {
        id: "demo-user-id",
        name: `${cookieRole} Demo User`,
        email: `${cookieRole.toLowerCase()}@dronet.io`,
        role: cookieRole,
        phone: "+8801700000000",
      },
    };
  }

  try {
    const res = await fetch(`${config.base_url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({ success: false }));
    return data;
  } catch (err) {
    console.error("Failed to fetch getMe", err);
    return { success: false, message: "Error fetching user session" };
  }
});
