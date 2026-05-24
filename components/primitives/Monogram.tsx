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
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={title}
      className={cn("inline-block align-middle", className)}
    >
      <rect width="64" height="64" fill={bg} />
      <path
        d="M8 8 L40 8 L40 40 L8 40 Z M8 8 L8 56 L56 56 L56 40 L40 40 Z"
        fill={corner}
      />
      <rect x="16" y="16" width="16" height="16" fill="#D4452C" />
    </svg>
  );
}
