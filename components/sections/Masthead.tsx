import { Container } from "@/components/primitives/Container";
import { AccentLine } from "@/components/primitives/AccentLine";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";

export function Masthead() {
  return (
    <header className="relative pt-12 md:pt-20">
      <div className="pointer-events-none absolute right-8 top-0 md:right-16 print:hidden">
        <AccentLine height="60vh" />
      </div>

      <Container>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          <span>Corner Software</span>
          <span aria-hidden="true" className="text-ink-faint">·</span>
          <span>Est. 2024</span>
          <span aria-hidden="true" className="text-ink-faint">·</span>
          <span>India</span>
          <ThemeToggle className="ml-auto mr-4" />
        </div>

        {/* Fade is CSS (globals.css --animate-masthead-rise); motion-safe skips
            it under prefers-reduced-motion. */}
        <h1 className="mt-16 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-balance motion-safe:animate-masthead-rise md:mt-24">
          Corner Software builds
          <br />
          software, and{" "}
          <span className="font-accent font-normal">runs</span> it.
          <br />
          <span className="font-accent font-normal">Four</span> so far.
        </h1>

        <div className="mt-16 border-t border-ink-rule pt-4 md:mt-24">
          <span className="font-mono text-[13px] tracking-[-0.01em] text-ink-muted">
            SEPTEMBER · 2026 / ISSUE 02
          </span>
        </div>
      </Container>
    </header>
  );
}
