import { Capture } from "@/components/site/Capture";
import type { Step } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** A capture framed as the screen it was taken on: a laptop display or a phone. */
export function Device({ step, sizes, className }: { step: Step; sizes: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-ink-rule bg-bg",
        step.device === "phone" ? "aspect-[390/844]" : "aspect-[16/10]",
        className,
      )}
    >
      <Capture shot={step} sizes={sizes} />
    </div>
  );
}
