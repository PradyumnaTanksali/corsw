import { Container } from "@/components/primitives/Container";

export function Colophon() {
  return (
    <footer className="border-t border-ink-rule">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        <span>Corner Software</span>
        <span>© 2024–2026</span>
      </Container>
    </footer>
  );
}
