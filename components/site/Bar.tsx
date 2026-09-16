import Link from "next/link";
import { Monogram } from "@/components/primitives/Monogram";
import { NEW_PROJECT_HREF } from "@/lib/projects";

/** The fixed top bar: the mark home and one call to action. No menu. */
export function Bar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-rule bg-bg print:hidden">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* ponytail: "/" on an unassigned *.corsw.in host rewrites to /demo, which is fine there. */}
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
        >
          <Monogram size={20} title="Corner Software, home" />
          <span className="hidden sm:inline">Corner Software</span>
        </Link>
        <a
          href={NEW_PROJECT_HREF}
          className="inline-flex items-center gap-2 font-mono text-[12px] text-accent"
        >
          <span className="link-draw">Start a project</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
