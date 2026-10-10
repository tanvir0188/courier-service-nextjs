"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("user_role");

  revalidateTag("my-profile", "max");
  redirect("/login");
};
