import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { AccentLine } from "@/components/primitives/AccentLine";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { NEW_PROJECT_HREF } from "@/lib/projects";

export function Masthead() {
  return (
    <header className="relative pt-12 md:pt-20">
      <div className="pointer-events-none absolute right-4 top-0 md:right-16 print:hidden">
        <AccentLine height="60vh" />
      </div>

      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted sm:tracking-[0.22em]">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span>Corner Software</span>
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="mr-3 text-ink-faint">·</span>
              Est. 2024
            </span>
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="mr-3 text-ink-faint">·</span>
              India
            </span>
          </p>
          <ThemeToggle className="ml-auto md:mr-4" />
        </div>

        {/* Fade is CSS (globals.css --animate-masthead-rise); motion-safe skips
            it under prefers-reduced-motion. The first break is desktop-only so
            phones don't orphan "builds". */}
        <h1 className="mt-16 max-w-[24ch] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-balance motion-safe:animate-masthead-rise md:mt-24">
          Corner Software builds{" "}
          <br className="hidden sm:inline" />
          software, and <span className="font-accent">runs</span> it.
          <br />
          <span className="font-accent">Four</span> so far.
        </h1>

        <div className="mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t border-ink-rule pt-4 font-mono text-[13px] tracking-[-0.01em] md:mt-24">
          <span className="text-ink-muted">SEPTEMBER · 2026 / ISSUE 02</span>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <a
              href={NEW_PROJECT_HREF}
              className="inline-flex items-center gap-2 text-accent transition-colors duration-150 hover:text-ink"
            >
              <span className="link-draw">Start a project</span>
              <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-ink transition-colors duration-150 hover:text-accent"
            >
              <span className="link-draw">See a platform running</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
