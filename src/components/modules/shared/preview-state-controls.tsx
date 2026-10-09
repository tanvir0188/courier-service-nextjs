"use client";

export type PreviewState = "data" | "loading" | "empty" | "error";

interface PreviewStateControlsProps {
  currentState: PreviewState;
  onChange: (state: PreviewState) => void;
}

export function PreviewStateControls({
  currentState,
  onChange,
}: PreviewStateControlsProps) {
  const states: { id: PreviewState; label: string }[] = [
    { id: "data", label: "Data" },
    { id: "loading", label: "Loading" },
    { id: "empty", label: "Empty" },
    { id: "error", label: "Error" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase hidden sm:inline">
        Preview State
      </span>
      <div className="inline-flex items-center rounded-lg border border-border/40 bg-muted/40 p-0.5">
        {states.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentState === id
                ? "bg-card text-foreground shadow-sm font-semibold border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
