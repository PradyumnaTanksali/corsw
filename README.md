# Corsw

The site for Corner Software, run by Pradyumna Tanksali: industry platforms (Arogyam, StreamLine, Ordio) and an engineering practice (SSC is an engagement), on one engineering foundation. A scroll-driven home page plus a `/products/<slug>` page per product, an `/engineering/<slug>` page per engagement, a `/demo` page, and one identity told in three scroll chapters (bone, ink, carbon) — there is no visitor-facing toggle.

`PRODUCT.md` holds what is true, `BRIEF.md` the structure, copy and rules, `DESIGN.md` the visual system. `CLAUDE.md` has the working rules.

## Stack

- Next.js 16 (App Router, `proxy.ts`), TypeScript strict
- Tailwind CSS 4
- GSAP (ScrollTrigger, SplitText, MotionPath) + `@gsap/react`, Lenis
- Schibsted Grotesk, EB Garamond, JetBrains Mono via `next/font`

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # node --test (host routing, tones, diagrams, projects)
pnpm build        # production build
pnpm start        # serve the build
```

## Deploy

Vercel project `corsw`, production branch `main`. Domains: `corsw.in` and the `*.corsw.in` wildcard — any subdomain not assigned to another project lands on `/demo`; `www.corsw.in` redirects to the apex.

Contact: hello@corsw.in
