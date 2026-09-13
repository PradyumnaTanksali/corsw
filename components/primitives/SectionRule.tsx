import { cn } from "@/lib/utils";
import { Ordinal } from "./Ordinal";

interface SectionRuleProps {
  n: number;
  label: string;
  className?: string;
}

export function SectionRule({ n, label, className }: SectionRuleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-t border-ink-rule pt-6 text-[11px] uppercase tracking-[0.22em] font-medium text-ink-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="font-accent text-ink-muted normal-case text-base"
      >
        — <Ordinal n={n} /> —
      </span>
      <span>{label}</span>
    </div>
  );
}
