import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/projects";

const LABEL: Record<ProjectStatus, string> = {
  operating: "Operating",
  "in-build": "In build",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-1.5",
          status === "operating"
            ? "bg-success"
            : "bg-warning",
        )}
      />
      <span>{LABEL[status]}</span>
    </span>
  );
}
