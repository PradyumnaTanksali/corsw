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
  labelWidth?: string;
  metaAlign?: "right" | "tag";
};

export function DataTable({
  caption,
  rows,
  className,
  labelWidth = "9rem",
  metaAlign = "right",
}: Props) {
  return (
    <table
      className={cn(
        "w-full font-mono text-[12.5px] tnum text-ink-muted",
        "border-collapse",
        className,
      )}
    >
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-ink-rule align-top last:border-b">
            <th
              scope="row"
              style={{ width: labelWidth }}
              className="text-left font-normal uppercase tracking-[0.12em] text-ink-faint py-2.5 pr-4"
            >
              {row.label}
            </th>
            <td className="py-2.5 pr-4 text-ink">{row.value}</td>
            {row.meta && (
              <td
                className={cn(
                  "py-2.5 text-ink-faint whitespace-nowrap",
                  metaAlign === "right" ? "text-right" : "text-left",
                )}
                style={{ width: "5rem" }}
              >
                {row.meta}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
