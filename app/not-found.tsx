import Link from "next/link";
import { Container } from "@/components/primitives/Container";

export default function NotFound() {
  return (
    <main id="content" data-tone-start="ink">
      {/* Not-found has no `metadata` export (see layout.tsx), so it renders
          its own <title>; React 19 hoists it into <head>. */}
      <title>Not found · Corner Software</title>
      <section data-tone="ink" className="flex min-h-svh flex-col justify-center pt-14">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">Not found</p>
          <h1 className="mt-6 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-balance">
            <span className="line-mask">
              <span className="line-rise">
                Nothing at this <span className="font-accent font-normal text-accent">corner.</span>
              </span>
            </span>
          </h1>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <span className="link-draw">Back to Corner Software</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>
    </main>
  );
}
