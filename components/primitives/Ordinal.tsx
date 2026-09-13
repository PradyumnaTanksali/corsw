import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * Paper counts in Roman (`II.`), Schematic in zero-padded Arabic (`02.`).
 * Both are rendered and the `schematic:` variant shows one; decorative, so
 * the surrounding label or list carries the meaning for screen readers.
 */
export function Ordinal({
  n,
  dot = false,
  className,
}: {
  n: number;
  dot?: boolean;
  className?: string;
}) {
  const suffix = dot ? "." : "";
  return (
    <span aria-hidden="true" className={cn("font-accent tabular-nums", className)}>
      <span className="schematic:hidden">
        {ROMAN[n - 1]}
        {suffix}
      </span>
      <span className="hidden schematic:inline">
        {String(n).padStart(2, "0")}
        {suffix}
      </span>
    </span>
  );
}
