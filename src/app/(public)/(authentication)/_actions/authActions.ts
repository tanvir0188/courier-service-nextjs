"use server";

import config from "@/config/config";
import { jwtUtils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]).default("CUSTOMER"),
  phone: z.string().optional(),
});

export type LoginActionState = {
  success: boolean;
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
} | null;

export const loginAction = async (
  redirectTo: string,
  prevState: LoginActionState,
  formData: FormData
) => {
  const rawData = Object.fromEntries(formData);
  const validated = LoginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
      data: rawData,
    };
  }

  let redirectUrl = "";

  try {
    const res = await fetch(`${config.base_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated.data),
    });

    const result = await res.json().catch(() => ({
      success: false,
      message: "Invalid response from server",
    }));

    if (!result.success) {
      return {
        ...result,
        message: result.message || "Invalid credentials",
        data: rawData,
      };
    }

    const token = result.data?.accessToken || result.data?.token;
    const refreshToken = result.data?.refreshToken;
    const userRole = result.data?.user?.role || "CUSTOMER";

    const cookieStore = await cookies();

    // Set session cookies accessible to both server and client apiClient / RBAC
    if (token) {
      cookieStore.set("accessToken", token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        path: "/",
      });
    }

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        path: "/",
      });
    }

    cookieStore.set("user_role", userRole, {
      httpOnly: false, // allow client role reading
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });

    revalidateTag("my-profile", "max");

    if (
      redirectTo &&
      typeof redirectTo === "string" &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//")
    ) {
      redirectUrl = redirectTo;
    } else if (userRole === "ADMIN") {
      redirectUrl = "/admin";
    } else if (userRole === "PROVIDER") {
      redirectUrl = "/provider";
    } else {
      redirectUrl = "/customer";
    }
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Backend server is sleeping or offline. Please try again.",
      data: rawData,
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
};

export const fastLoginDemoAction = async (
  role: "customer" | "provider" | "admin",
  redirectTo: string
) => {
  let email = "";
  let password = "";

  if (role === "admin") {
    email = process.env.SUPER_ADMIN_EMAIL || "superadmin@gmail.com";
    password = process.env.SUPER_ADMIN_PASSWORD || "Super@admin12345";
  } else if (role === "provider") {
    email = process.env.TESTER_PROVIDER_EMAIL || "testerprovider@gmail.com";
    password = process.env.TESTER_PROVIDER_PASSWORD || "Tester@provider12345";
  } else {
    email = "arnob0188@gmail.com";
    password = "Arn@b0188";
  }

  // First try backend credentials login
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const loginResult = await loginAction(redirectTo, null, formData);

  // If backend returns error, create demo cookie session directly for seamless inspection
  if (loginResult && !loginResult.success) {
    const roleUpper = role.toUpperCase() as "CUSTOMER" | "PROVIDER" | "ADMIN";
    const cookieStore = await cookies();

    const dummyToken = `demo_${role}_token`;
    cookieStore.set("accessToken", dummyToken, {
      httpOnly: false,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });
    cookieStore.set("user_role", roleUpper, {
      httpOnly: false,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });

    const target =
      redirectTo && redirectTo.startsWith("/")
        ? redirectTo
        : role === "admin"
          ? "/admin"
          : role === "provider"
            ? "/provider"
            : "/customer";

    redirect(target);
  }

  return loginResult;
};

export const registerAction = async (
  redirectTo: string,
  prevState: any,
  formData: FormData
) => {
  const rawData = Object.fromEntries(formData);
  const validated = RegisterSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
      data: rawData,
    };
  }

  try {
    const res = await fetch(`${config.base_url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated.data),
    });

    const result = await res.json().catch(() => ({
      success: false,
      message: "Invalid response from server",
    }));

    if (!result.success) {
      return {
        ...result,
        data: rawData,
      };
    }

    redirect("/login");
  } catch (error) {
    console.error("Register action error:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Backend server is sleeping or offline. Try again.",
      data: rawData,
    };
  }
};

export const googleLoginAction = async () => {
  redirect(`${config.base_url}/auth/google`);
};
