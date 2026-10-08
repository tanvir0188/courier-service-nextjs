import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(11, "Phone number must be at least 11 digits").optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
