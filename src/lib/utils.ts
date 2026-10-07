import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "৳ 0";
  }
  const numeric = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return `৳ ${numeric.toLocaleString("en-BD")}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return `${d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })}, ${d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return dateString;
  }
}
