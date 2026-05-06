import { cn } from "@/lib/utils";

interface MonogramProps {
  size?: number;
  variant?: "dark" | "light";
  className?: string;
  title?: string;
}

export function Monogram({
  size = 24,
  variant = "dark",
  className,
  title = "Corner Software",
}: MonogramProps) {
  const bg = variant === "dark" ? "#0E0E0E" : "#F5F1E8";
  const corner = variant === "dark" ? "#F5F1E8" : "#0E0E0E";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={title}
      className={cn("inline-block align-middle", className)}
    >
      <rect width="24" height="24" fill={bg} />
      <rect width="12" height="12" fill={corner} />
      <rect x="3" y="3" width="6" height="6" fill="#D4452C" />
    </svg>
  );
}
