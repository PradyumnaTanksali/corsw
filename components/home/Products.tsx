"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { projectHref, type Project } from "@/lib/projects";

/**
 * Chapter A. Desktop with motion: the stage pins and plays the products in
 * turn (the capture opens, the name gains weight, the rail tracks progress).
 * Phones and reduced motion: the same articles in normal flow.
 */
type ProductItem = Pick<Project, "kind" | "slug" | "n" | "name" | "status" | "tagline" | "capture">;

export function Products({ products }: { products: ProductItem[] }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        el.setAttribute("data-live", "");
        const items = gsap.utils.toArray<HTMLElement>("[data-work-item]", el);
        const rail = gsap.utils.toArray<HTMLElement>("[data-rail-item]", el);
        const setActive = (index: number) => {
          rail.forEach((r, j) => r.toggleAttribute("data-active", j === index));
          // Mirrors the rail's active state onto the items so CSS can turn off
          // pointer-events on the stacked, invisible (opacity 0) siblings.
          items.forEach((it, j) => it.toggleAttribute("data-active", j === index));
        };
        setActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * items.length}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
          },
        });

        items.forEach((item, i) => {
          const q = gsap.utils.selector(item);
          // Per project i: fades in at i-0.12, frame/media/name open over
          // i..i+0.55, meta follows at i+0.3, fade-out runs i+0.76..i+0.88;
          // the last project has no fade-out and holds through the tail tween.
          if (i > 0) tl.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.12 }, i - 0.12);
          tl.fromTo(q("[data-frame]"), { clipPath: "inset(20% 26% 20% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, i)
            .fromTo(q("[data-media]"), { scale: 1.3 }, { scale: 1, duration: 0.55 }, i)
            .fromTo(q("[data-name]"), { fontWeight: 400 }, { fontWeight: 800, duration: 0.55 }, i)
            .fromTo(q("[data-meta]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.05 }, i + 0.3);
          // Out before the next fades in, so two projects never overlap.
          if (i < items.length - 1) tl.to(item, { opacity: 0, duration: 0.12 }, i + 0.76);
        });
        // Hold the last project open before the pin releases.
        tl.to({}, { duration: 0.45 });

        // Tab into a stacked-but-invisible item (opacity 0, still in the tab
        // order since we tween opacity and not autoAlpha): scroll so the
        // pinned timeline opens it, using the same "open" position (i+0.55)
        // the enter tween above targets.
        const st = tl.scrollTrigger;
        const onFocusIn = (event: FocusEvent) => {
          const item = (event.target as HTMLElement).closest<HTMLElement>("[data-work-item]");
          if (!item || !st) return;
          const i = items.indexOf(item);
          if (i === -1) return;
          const top = st.start + ((i + 0.55) / tl.duration()) * (st.end - st.start);
          window.scrollTo({ top, behavior: "instant" });
        };
        el.addEventListener("focusin", onFocusIn);

        return () => {
          el.removeAttribute("data-live");
          el.removeEventListener("focusin", onFocusIn);
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)", () => {
        for (const frame of gsap.utils.toArray<HTMLElement>("[data-frame]", el)) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(12% 12% 12% 12%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top 90%", end: "top 40%", scrub: true },
            },
          );
        }
      });
    },
    { scope: stage },
  );

  return (
    <section data-tone="ink" id="products" aria-labelledby="products-title" className="pt-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={2} label="Products" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="products-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Built for whole <span className="font-accent text-accent">industries.</span>
            </SplitReveal>
            <p className="mt-8 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
              Each platform is designed around how an industry works, then configured for every business
              that runs on it.
            </p>
          </div>
        </div>
      </Container>

      <div ref={stage} className="relative mt-20 md:mt-28 data-live:h-svh">
        <ol
          data-rail
          aria-hidden="true"
          className="absolute left-8 top-1/2 z-10 -translate-y-1/2 flex-col gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint lg:left-16"
        >
          {products.map((p) => (
            <li key={p.slug} data-rail-item className="transition-colors duration-300 data-active:text-ink">
              <Ordinal n={p.n} dot className="mr-2 text-[15px] normal-case tracking-normal text-accent" />
              {p.name}
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-24 pb-8 in-data-live:gap-0 in-data-live:pb-0">
          {products.map((p, i) => (
            <article key={p.slug} data-work-item aria-labelledby={`product-${p.slug}`} className="flex items-center">
              <Container className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-9 md:col-start-4">
                  {/* Duplicates the name link below; kept out of tab order and the
                      accessibility tree so each project is one tab stop, not two. */}
                  <Link href={projectHref(p)} tabIndex={-1} aria-hidden="true" className="block">
                    <div
                      data-frame
                      className="relative aspect-[16/10] w-full overflow-hidden border border-ink-rule bg-bg-card md:max-w-[calc((100svh-19rem)*1.6)]"
                    >
                      <ViewTransition name={`capture-${p.slug}`}>
                        <div data-media className="absolute inset-0">
                          <Capture shot={p.capture} sizes="(min-width: 768px) 70vw, 100vw" priority={i === 0} />
                        </div>
                      </ViewTransition>
                    </div>
                  </Link>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                    <h3
                      id={`product-${p.slug}`}
                      data-name
                      className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
                    >
                      <Link href={projectHref(p)}>{p.name}</Link>
                    </h3>
                    <div data-meta className="pb-2">
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <p data-meta className="mt-3 max-w-[46ch] text-[17px] leading-[1.5] text-ink-muted">
                    {p.tagline}
                  </p>
                  <Link
                    data-meta
                    href={projectHref(p)}
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[13px] text-accent"
                  >
                    <span className="link-draw">Explore {p.name}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Container>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
