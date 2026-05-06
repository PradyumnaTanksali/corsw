import { cn } from "@/lib/utils";

interface NumeralProps {
  value: string;
  size?: "sm" | "md" | "lg";
  accent?: boolean;
  className?: string;
}

export function Numeral({
  value,
  size = "md",
  accent = false,
  className,
}: NumeralProps) {
  const sizeClass =
    size === "lg"
      ? "text-5xl md:text-7xl"
      : size === "md"
        ? "text-2xl md:text-4xl"
        : "text-lg md:text-xl";

  return (
    <span
      className={cn(
        "font-serif italic tracking-[0.02em] tabular-nums",
        sizeClass,
        accent && "text-accent",
        className,
      )}
      aria-hidden="true"
    >
      {value}
    </span>
  );
}
