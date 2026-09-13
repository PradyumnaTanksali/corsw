import { cn } from "@/lib/utils";

export type Row = {
  label: string;
  value: React.ReactNode;
  meta?: string;
};

type Props = {
  caption?: string;
  rows: Row[];
  className?: string;
};

export function DataTable({ caption, rows, className }: Props) {
  return (
    <table
      className={cn(
        "w-full border-collapse font-mono text-[12.5px] tabular-nums text-ink-muted",
        className,
      )}
    >
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-ink-rule align-top last:border-b">
            <th
              scope="row"
              className="w-28 py-2.5 pr-4 text-left font-normal uppercase tracking-[0.12em] text-ink-faint"
            >
              {row.label}
            </th>
            <td className="py-2.5 pr-4 text-ink">{row.value}</td>
            {/* Reference codes are decoration; phones give their width to the value. */}
            {row.meta && (
              <td className="hidden w-14 whitespace-nowrap py-2.5 text-right text-ink-faint sm:table-cell">
                {row.meta}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
