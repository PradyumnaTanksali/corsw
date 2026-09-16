import { cn } from "@/lib/utils";
import { Ordinal } from "./Ordinal";

interface SectionRuleProps {
  n: number;
  label: string;
  className?: string;
}

/** The section folio: a hairline, the ordinal, the section name. */
export function SectionRule({ n, label, className }: SectionRuleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 self-start border-t border-ink-rule pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted",
        className,
      )}
    >
      <Ordinal n={n} dot className="text-base normal-case tracking-normal text-accent" />
      <span>{label}</span>
    </div>
  );
}
