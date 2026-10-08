export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isEmailVerified: boolean;
  profilePic?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}
