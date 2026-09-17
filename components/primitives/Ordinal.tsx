import { cn } from "@/lib/utils";

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

/** A lower-case Roman numeral in the accent face. Decorative: the adjacent label carries the meaning. */
export function Ordinal({
  n,
  dot = false,
  className,
}: {
  n: number;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("font-accent tabular-nums", className)}>
      {ROMAN[n - 1]}
      {dot ? "." : ""}
    </span>
  );
}
