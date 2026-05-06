import { Numeral } from "./Numeral";

interface InventoryRow {
  label: string;
  value: string;
}

interface DivisionCardProps {
  ordinal: string;
  wordmark: string;
  role: string;
  description: string;
  inventory: InventoryRow[];
  href: string;
  hrefLabel: string;
}

export function DivisionCard({
  ordinal,
  wordmark,
  role,
  description,
  inventory,
  href,
  hrefLabel,
}: DivisionCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col border border-ink-rule bg-bg-card p-8 transition-colors duration-150 hover:border-accent md:p-10"
    >
      <div className="flex items-baseline justify-between">
        <Numeral value={ordinal} size="lg" accent />
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
          Division
        </span>
      </div>

      <div className="mt-8 text-3xl font-medium uppercase tracking-normal md:text-4xl">
        {wordmark}
      </div>

      <p className="mt-3 text-[15px] text-ink-muted md:text-base">{role}</p>

      <p className="mt-8 max-w-md text-[15px] leading-[1.6] text-ink md:text-base">
        {description}
      </p>

      <dl className="mt-10 space-y-2 font-mono text-[13px] leading-[1.7] text-ink-muted">
        {inventory.map((row) => (
          <div key={row.label} className="flex gap-4">
            <dt className="w-20 shrink-0 uppercase tracking-[0.12em] text-ink-faint">
              {row.label}
            </dt>
            <dd className="text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-12">
        <span className="font-mono text-[13px] tracking-[-0.01em] text-ink-muted transition-colors duration-150 group-hover:text-accent">
          {hrefLabel} <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
