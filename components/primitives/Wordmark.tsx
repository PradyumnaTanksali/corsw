import { cn } from "@/lib/utils";

interface WordmarkProps {
  text: string;
  spaced?: boolean;
  className?: string;
}

export function Wordmark({ text, spaced = false, className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-medium uppercase",
        spaced ? "tracking-[0.04em]" : "tracking-normal",
        className,
      )}
    >
      {text}
    </span>
  );
}
