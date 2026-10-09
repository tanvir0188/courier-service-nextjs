import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  let styles = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  let dotColor = "bg-slate-400";

  switch (normalized) {
    case "DELIVERED":
    case "SUCCESSFUL":
    case "SUCCESS":
    case "ACTIVE":
    case "AVAILABLE":
      styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      dotColor = "bg-emerald-400";
      break;

    case "OUT_FOR_DELIVERY":
    case "ON_DELIVERY":
    case "COURIER_ASSIGNED":
    case "ASSIGNED":
      styles = "bg-amber-500/10 text-amber-300 border-amber-500/25";
      dotColor = "bg-amber-400";
      break;

    case "IN_TRANSIT":
    case "PROCESSING":
    case "PAYMENT_CONFIRMED":
    case "PICKED_UP":
      styles = "bg-sky-500/10 text-sky-400 border-sky-500/25";
      dotColor = "bg-sky-400";
      break;

    case "DELIVERY_FAILED":
    case "FAILED":
    case "SUSPENDED":
    case "OFFLINE":
    case "OFF_DUTY":
      styles = "bg-rose-500/10 text-rose-400 border-rose-500/25";
      dotColor = "bg-rose-400";
      break;

    case "RETURNED":
    case "CANCELLED":
      styles = "bg-zinc-500/10 text-zinc-400 border-zinc-500/25";
      dotColor = "bg-zinc-400";
      break;

    default:
      styles = "bg-muted text-muted-foreground border-border/40";
      dotColor = "bg-muted-foreground";
      break;
  }

  // Friendly display format
  const formatText = (str: string) => {
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotColor)} />
      {formatText(status)}
    </span>
  );
}
