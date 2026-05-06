import { cn } from "@/lib/utils";

interface SectionRuleProps {
  numeral: string;
  label: string;
  className?: string;
}

export function SectionRule({ numeral, label, className }: SectionRuleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-t border-ink-rule pt-6 text-[11px] uppercase tracking-[0.22em] font-medium text-ink-muted",
        className,
      )}
    >
      <span className="font-serif italic text-ink-muted normal-case tracking-[0.02em] text-base">
        — {numeral} —
      </span>
      <span>{label}</span>
    </div>
  );
}
