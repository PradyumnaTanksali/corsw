import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { products, projectHref, type Project } from "@/lib/projects";

const productNames = products.map((p) => p.name);
const allProductsLine = `${productNames.slice(0, -1).join(", ")} and ${productNames.at(-1)}.`;

/** Products cycle to the next product; engagements point back to the products. */
export function NextProject({ next }: { next: Project | null }) {
  const href = next ? projectHref(next) : "/#products";
  const label = next ? "Next product" : "All products";
  const title = next ? next.name : "Products";
  const line = next ? next.tagline : allProductsLine;

  return (
    <section data-tone="ink" aria-label={label} className="border-t border-ink-rule">
      <Link href={href} className="group block">
        <Container className="py-24 md:py-40">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            {label} <span aria-hidden="true">→</span>
          </p>
          <p className="mt-6 text-[clamp(3.5rem,12vw,11rem)] font-normal leading-[0.85] tracking-[-0.05em] transition-[font-weight,color] duration-700 group-hover:font-extrabold group-hover:text-accent group-focus-visible:font-extrabold group-focus-visible:text-accent">
            {title}
          </p>
          <p className="mt-6 max-w-[40ch] text-lg leading-[1.5] text-ink-muted">{line}</p>
        </Container>
      </Link>
    </section>
  );
}
