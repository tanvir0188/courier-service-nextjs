import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  subtext,
  trend,
  actionText,
  onAction,
  icon,
}: StatCardProps) {
  return (
    <Card className="p-5 border-border/40 bg-card/60 backdrop-blur-sm relative overflow-hidden transition-all hover:border-border/80">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-mono font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </div>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
          {value}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        {trend && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            {trend}
          </span>
        )}
        {subtext && (
          <span className="text-muted-foreground truncate">{subtext}</span>
        )}
        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="text-primary hover:underline font-medium ml-auto"
          >
            {actionText}
          </button>
        )}
      </div>
    </Card>
  );
}
