import { DEMO_EMAIL, type Project } from "@/lib/projects";
import {
  ArogyamDiagram,
  OrdioDiagram,
  SscDiagram,
  StreamlineDiagram,
} from "@/components/primitives/SystemDiagram";
import { DataTable } from "@/components/primitives/DataTable";
import { Ordinal } from "@/components/primitives/Ordinal";
import { StatusBadge } from "@/components/primitives/StatusBadge";

const diagrams = {
  arogyam: ArogyamDiagram,
  streamline: StreamlineDiagram,
  ordio: OrdioDiagram,
  ssc: SscDiagram,
} as const;

export function ProjectCard({ project }: { project: Project }) {
  const Diagram = diagrams[project.diagram];

  return (
    <article className="grid grid-cols-1 gap-y-10 border-t border-ink-rule py-12 last:pb-0 md:py-16 md:last:pb-0 lg:grid-cols-12 lg:gap-x-10">
      <div className="order-2 lg:order-1 lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
        <div className="border border-ink-rule bg-bg-card p-5 md:p-7">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
            <span>System diagram</span>
            <span className="tabular-nums">{project.diagramLabel}</span>
          </div>
          <div className="mt-4">
            <Diagram />
          </div>
        </div>
      </div>

      <div className="order-1 flex flex-col lg:order-2 lg:col-span-5">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-baseline font-mono text-[12.5px] tabular-nums">
            <Ordinal n={project.n} className="text-[15px] text-accent" />
            <span aria-hidden="true" className="mx-2 text-ink-faint">
              /
            </span>
            <span className="uppercase tracking-[0.12em] text-ink">
              {project.name}
            </span>
          </p>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="mt-5 text-[clamp(1.375rem,2.4vw,1.75rem)] font-medium leading-[1.18] tracking-[-0.02em] text-ink text-balance">
          {project.tagline}
        </h3>

        <div className="mt-5 space-y-4 text-[15px] leading-[1.65] text-ink-muted">
          {project.description.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        <div className="mt-7">
          <DataTable
            caption={`${project.name} at a glance`}
            rows={project.table}
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-end gap-6">
          {project.status === "operating" && (
            <a
              href={`mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(`Demo request — ${project.name}`)}`}
              className="inline-flex items-center gap-2 font-mono text-[12px] text-accent transition-colors duration-150 hover:text-ink"
            >
              <span className="link-draw">ask for a demo</span>
              <span aria-hidden="true">→</span>
            </a>
          )}
          <a
            href={project.link.href}
            className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-muted transition-colors duration-150 hover:text-accent"
          >
            <span className="link-draw">{project.link.label}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
