import { Monogram } from "./Monogram";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

interface LockupProps {
  size?: number;
  variant?: "dark" | "light";
  className?: string;
}

export function Lockup({
  size = 24,
  variant = "dark",
  className,
}: LockupProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 align-middle",
        className,
      )}
    >
      <Monogram size={size} variant={variant} />
      <Wordmark text="CORSW" spaced className="text-base md:text-lg" />
    </span>
  );
}
